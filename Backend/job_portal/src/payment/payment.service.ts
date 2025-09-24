import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/Entities/payment.entity';
import { Subscription } from 'src/Entities/subscription.entity';
import { PaymentDTO } from 'src/DTOs/payment.dto';
import axios from 'axios';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  async initiatePayment(data: PaymentDTO): Promise<any> {
    try {
      const transactionId = 'TXN-' + Date.now();

      // Save initial payment
      const newPayment = this.paymentRepo.create({
        ...data,
        transactionId,
        status: 'Pending',
      });
      await this.paymentRepo.save(newPayment);

      // Prepare SSLCommerz payload
      const sslData = new URLSearchParams({
        store_id: process.env.SSLC_STORE_ID!,
        store_passwd: process.env.SSLC_STORE_PASSWORD!,
        total_amount: data.amount.toString(),
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.BACKEND_URL!}/payment/success?tran_id=${transactionId}`,
        fail_url: `${process.env.FRONTEND_URL!}/payment/fail?tran_id=${transactionId}`,
        cancel_url: `${process.env.FRONTEND_URL!}/payment/cancel?tran_id=${transactionId}`,
        ipn_url: `${process.env.BACKEND_URL!}/payment/ipn`,

        // Product + Customer info
        product_name: 'Premium Subscription',
        product_category: 'Subscription',
        product_profile: 'general',
        shipping_method: 'NO',
        cus_name: data.fullName,
        cus_email: data.email,
        cus_add1: data.address || 'Dhaka',
        cus_add2: data.address || 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: data.phone,
        cus_fax: data.phone,
        ship_name: data.fullName,
        ship_add1: data.address || 'Dhaka',
        ship_add2: data.address || 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
      });

      const response = await axios.post(
        'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
        sslData.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      if (response.data?.status === 'SUCCESS') {
        return {
          GatewayPageURL: response.data.GatewayPageURL,
          transactionId,
        };
      } else {
        throw new InternalServerErrorException(
          'SSLCommerz API call failed. Check backend logs.',
        );
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Payment initiation failed. Check backend logs.',
      );
    }
  }

  async updatePaymentStatus(tran_id: string, status: string): Promise<string> {
    const payment = await this.paymentRepo.findOne({
      where: { transactionId: tran_id },
    });

    if (!payment) {
      throw new BadRequestException('Transaction not found');
    }

    if (payment.status === 'Success') {
      return `Payment already processed as Success.`;
    }

    payment.status = status;
    await this.paymentRepo.save(payment);

    if (status === 'Success') {
      const expiryDate = moment().add(1, 'month').toDate();

      let sub = await this.subscriptionRepo.findOne({
        where: { jobSeekerId: payment.jobSeekerId },
      });

      if (sub) {
        sub.isPremium = true;
        sub.expiresAt = expiryDate;
      } else {
        sub = this.subscriptionRepo.create({
          jobSeekerId: payment.jobSeekerId,
          isPremium: true,
          expiresAt: expiryDate,
        });
      }
      await this.subscriptionRepo.save(sub);
      return `Payment updated to Success. Subscription activated.`;
    }

    return `Payment updated to ${status}`;
  }

  async verifyPayment(tranId: string) {
    try {
      const payload = new URLSearchParams({
        store_id: process.env.SSLC_STORE_ID!,
        store_passwd: process.env.SSLC_STORE_PASSWORD!,
        tran_id: tranId,
        format: 'json',
      });

      const response = await axios.post(
        'https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php',
        payload.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      return response.data;
    } catch (error) {
      console.error('SSLCommerz verification failed:', error);
      throw new InternalServerErrorException(
        'Failed to verify payment with SSLCommerz.',
      );
    }
  }
}
