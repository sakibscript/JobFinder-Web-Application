import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from 'src/Entities/payment.entity';
import { Subscription } from 'src/Entities/subscription.entity';
import { PaymentDTO } from 'src/DTOs/payment.dto';
import axios from 'axios';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {}

  async initiatePayment(data: PaymentDTO): Promise<any> {
    try {
      const transactionId = 'TXN-' + Date.now();

      this.logger.log(
        `Initiating payment for jobSeeker: ${data.jobSeekerId}, Transaction: ${transactionId}`,
      );

      // Save initial payment
      const newPayment = this.paymentRepo.create({
        jobSeekerId: data.jobSeekerId,
        transactionId: transactionId,
        amount: data.amount,
        status: PaymentStatus.PENDING,
        currency: 'BDT',
        plan: data.plan,
        paymentMethod: data.paymentMethod,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        createdAt: new Date(),
      });

      await this.paymentRepo.save(newPayment);
      const sslData = new URLSearchParams({
        store_id: process.env.SSLC_STORE_ID!,
        store_passwd: process.env.SSLC_STORE_PASSWORD!,
        total_amount: data.amount.toString(),
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.BACKEND_URL}/payment/success`,
        fail_url: `${process.env.BACKEND_URL}/payment/fail`,
        cancel_url: `${process.env.BACKEND_URL}/payment/cancel`,
        ipn_url: `${process.env.BACKEND_URL}/payment/ipn`,
        product_name: `Premium Subscription - ${data.plan || 'Monthly'}`,
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
        ship_name: data.fullName,
        ship_add1: data.address || 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
      });

      const response = await axios.post(
        'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
        sslData.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 30000,
        },
      );

      if (response.data?.status === 'SUCCESS') {
        return {
          GatewayPageURL: response.data.GatewayPageURL,
          transactionId,
        };
      } else {
        throw new InternalServerErrorException('Payment gateway unavailable.');
      }
    } catch (error) {
      this.logger.error('Payment initiation error:', error);
      throw new InternalServerErrorException('Payment initiation failed.');
    }
  }

  async verifyPayment(tranId: string): Promise<any> {
    this.logger.log(
      `SIMPLIFIED VERIFICATION - Assuming payment success for: ${tranId}`,
    );

    return {
      status: 'VALID',
      tran_id: tranId,
      amount: '500.00',
      currency: 'BDT',
      val_id: 'dev_' + Date.now(),
      bank_tran_id: 'bank_dev_' + Date.now(),
    };
  }

  async updatePaymentStatus(
    tran_id: string,
    status: string,
    bank_tran_id?: string,
  ): Promise<string> {
    const payment = await this.paymentRepo.findOne({
      where: { transactionId: tran_id },
    });

    if (!payment) {
      throw new BadRequestException('Transaction not found');
    }

    let paymentStatus: PaymentStatus;
    switch (status.toLowerCase()) {
      case 'success':
        paymentStatus = PaymentStatus.SUCCESS;
        break;
      case 'failed':
        paymentStatus = PaymentStatus.FAILED;
        break;
      case 'cancelled':
        paymentStatus = PaymentStatus.CANCELLED;
        break;
      default:
        paymentStatus = PaymentStatus.PENDING;
    }

    payment.status = paymentStatus;
    payment.updatedAt = new Date();

    if (bank_tran_id) {
      payment.bankTransactionId = bank_tran_id;
    }

    await this.paymentRepo.save(payment);

    if (paymentStatus === PaymentStatus.SUCCESS) {
      await this.activatePremiumSubscription(
        payment.jobSeekerId,
        payment.amount,
      );
      return `Payment successful. Subscription activated.`;
    }

    return `Payment status: ${paymentStatus}`;
  }

  private async activatePremiumSubscription(
    jobSeekerId: number,
    amount: number,
  ): Promise<void> {
    try {
      let expiryDate: Date;

      if (amount >= 5000) {
        expiryDate = moment().add(100, 'years').toDate();
      } else if (amount >= 2500) {
        expiryDate = moment().add(1, 'year').toDate();
      } else {
        expiryDate = moment().add(1, 'month').toDate();
      }

      let subscription = await this.subscriptionRepo.findOne({
        where: { jobSeekerId },
      });

      if (subscription) {
        subscription.isPremium = true;
        subscription.expiresAt = expiryDate;
        subscription.updatedAt = new Date();
      } else {
        subscription = this.subscriptionRepo.create({
          jobSeekerId,
          isPremium: true,
          expiresAt: expiryDate,
          createdAt: new Date(),
        });
      }

      await this.subscriptionRepo.save(subscription);
      this.logger.log(`Premium activated for jobSeeker: ${jobSeekerId}`);
    } catch (error) {
      this.logger.error(`Error activating premium:`, error);
      throw new InternalServerErrorException('Subscription activation failed');
    }
  }
}
