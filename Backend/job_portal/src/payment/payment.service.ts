// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Payment } from 'src/Entities/payment.entity';
// import { Subscription } from 'src/Entities/subscription.entity';
// import { PaymentDTO } from 'src/DTOs/payment.dto';
// import axios from 'axios';
// import * as moment from 'moment';

// @Injectable()
// export class PaymentService {
//   constructor(
//     @InjectRepository(Payment)
//     private paymentRepo: Repository<Payment>,

//     @InjectRepository(Subscription)
//     private subscriptionRepo: Repository<Subscription>,
//   ) {}

//   async initiatePayment(data: PaymentDTO): Promise<any> {
//     const transactionId = 'TXN-' + Date.now();

//     // Save initial payment with 'Pending' status
//     const newPayment = this.paymentRepo.create({
//       ...data,
//       transactionId,
//       status: 'Pending',
//     });
//     await this.paymentRepo.save(newPayment);

//     const sslData = {
//       store_id: process.env.SSLC_STORE_ID,
//       store_passwd: process.env.SSLC_STORE_PASSWORD,
//       total_amount: data.amount,
//       currency: 'BDT',
//       tran_id: transactionId,
//       success_url:
//         'http://jobPortal.com/payment/success?tran_id=' + transactionId,
//       fail_url: 'http://jobPortal.com/payment/fail?tran_id=' + transactionId,
//       cancel_url:
//         'http://jobPortal.com/payment/cancel?tran_id=' + transactionId,
//       cus_name: 'User',
//       cus_email: 'user@email.com',
//       cus_add1: 'Dhaka',
//       cus_phone: '01711111111',
//       product_category: 'Service',
//       product_profile: 'general',
//     };

//     const response = await axios.post(
//       'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
//       sslData,
//     );

//     return response.data;
//   }

//   async updatePaymentStatus(tran_id: string, status: string): Promise<string> {
//     const payment = await this.paymentRepo.findOne({
//       where: { transactionId: tran_id },
//     });

//     if (!payment) {
//       return 'Transaction not found';
//     }

//     payment.status = status;
//     await this.paymentRepo.save(payment);

//     if (status === 'Success') {
//       // Grant premium subscription for 1 month
//       const expiryDate = moment().add(1, 'month').toDate();

//       let sub = await this.subscriptionRepo.findOne({
//         where: { jobSeekerId: payment.jobSeekerId },
//       });

//       if (sub) {
//         sub.isPremium = true;
//         sub.expiresAt = expiryDate;
//       } else {
//         sub = this.subscriptionRepo.create({
//           jobSeekerId: payment.jobSeekerId,
//           isPremium: true,
//           expiresAt: expiryDate,
//         });
//       }

//       await this.subscriptionRepo.save(sub);
//     }

//     return `Payment updated to ${status}`;
//   }
// }

import { Injectable } from '@nestjs/common';
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
    const transactionId = 'TXN-' + Date.now();

    // 1. Save payment with 'Pending' status
    const newPayment = this.paymentRepo.create({
      ...data,
      transactionId,
      status: 'Pending',
    });

    await this.paymentRepo.save(newPayment);

    // 2. Prepare SSLCOMMERZ Payload
    const sslData = {
      store_id: process.env.SSLC_STORE_ID,
      store_passwd: process.env.SSLC_STORE_PASSWORD,
      total_amount: data.amount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `http://jobPortal.com/payment/success?tran_id=${transactionId}`,
      fail_url: `http://jobPortal.com/payment/fail?tran_id=${transactionId}`,
      cancel_url: `http://jobPortal.com/payment/cancel?tran_id=${transactionId}`,
      cus_name: 'User',
      cus_email: 'user@email.com',
      cus_add1: 'Dhaka',
      cus_phone: '01711111111',
      product_category: 'Service',
      product_profile: 'general',
    };

    // 3. Send request to SSLCOMMERZ
    const response = await axios.post(
      'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
      sslData,
    );

    // 4. Handle success response
    if (response.data?.status === 'SUCCESS') {
      return {
        GatewayPageURL: response.data.GatewayPageURL,
        transactionId,
      };
    } else {
      throw new Error('Failed to initiate payment with SSLCOMMERZ');
    }
  }

  async updatePaymentStatus(tran_id: string, status: string): Promise<string> {
    // 1. Find payment record
    const payment = await this.paymentRepo.findOne({
      where: { transactionId: tran_id },
    });

    if (!payment) {
      return 'Transaction not found';
    }

    // 2. Update status
    if (payment.status !== 'Pending') {
      return `Payment already marked as ${payment.status}`;
    }

    payment.status = status;
    await this.paymentRepo.save(payment);

    // 3. If successful, grant premium
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
    }

    return `Payment updated to ${status}`;
  }
}
