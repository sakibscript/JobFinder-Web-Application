// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Query,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { PaymentService } from './payment.service';
// import { PaymentDTO } from 'src/DTOs/payment.dto';
// import { Public } from 'src/Auth/public.decorator';

// @Controller('payment')
// export class PaymentController {
//   constructor(private readonly paymentService: PaymentService) {}

//   @Post('initiate')
//   async initiatePayment(@Body() paymentData: PaymentDTO) {
//     return await this.paymentService.initiatePayment(paymentData);
//   }

//   @Public()
//   @Get('success')
//   async paymentSuccess(@Query('tran_id') tranId: string) {
//     if (!tranId) {
//       throw new InternalServerErrorException('Transaction ID not found.');
//     }

//     const verificationResult = await this.paymentService.verifyPayment(tranId);

//     if (
//       verificationResult.status === 'VALID' ||
//       verificationResult.status === 'VALIDATED'
//     ) {
//       const statusMessage = await this.paymentService.updatePaymentStatus(
//         tranId,
//         'Success',
//       );
//       return {
//         success: true,
//         message: 'Payment verified and status updated successfully.',
//         details: statusMessage,
//       };
//     } else {
//       await this.paymentService.updatePaymentStatus(tranId, 'Failed');
//       return {
//         success: false,
//         message: 'Payment verification failed.',
//         details: verificationResult.failedreason,
//       };
//     }
//   }

//   @Public()
//   @Post('ipn')
//   async paymentIpn(@Body() body: any) {
//     const { tran_id, status } = body;
//     if (!tran_id || !status) {
//       return 'Invalid IPN request';
//     }

//     const verificationResult = await this.paymentService.verifyPayment(tran_id);

//     if (
//       verificationResult.status === 'VALID' ||
//       verificationResult.status === 'VALIDATED'
//     ) {
//       const result = await this.paymentService.updatePaymentStatus(
//         tran_id,
//         'Success',
//       );
//       return { message: 'IPN processed successfully', details: result };
//     } else {
//       const result = await this.paymentService.updatePaymentStatus(
//         tran_id,
//         'Failed',
//       );
//       return { message: 'IPN verification failed', details: result };
//     }
//   }

//   @Get('fail')
//   async paymentFail(@Query('tran_id') tran_id: string) {
//     const result = await this.paymentService.updatePaymentStatus(
//       tran_id,
//       'Failed',
//     );
//     return { message: 'Payment failed', details: result };
//   }

//   @Get('cancel')
//   async paymentCancel(@Query('tran_id') tran_id: string) {
//     const result = await this.paymentService.updatePaymentStatus(
//       tran_id,
//       'Cancelled',
//     );
//     return { message: 'Payment cancelled', details: result };
//   }
// }
import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDTO } from 'src/DTOs/payment.dto';
import { Public } from 'src/Auth/public.decorator';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() paymentData: PaymentDTO) {
    return await this.paymentService.initiatePayment(paymentData);
  }

  @Public()
  @Get('success-redirect')
  async successRedirect(
    @Query('tran_id') tranId: string,
    @Res() res: Response,
  ) {
    const verification = await this.paymentService.verifyPayment(tranId);

    if (
      verification.status === 'VALID' ||
      verification.status === 'VALIDATED'
    ) {
      await this.paymentService.updatePaymentStatus(tranId, 'Success');
      // Redirect directly to frontend dashboard
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?paid=success`);
    } else {
      await this.paymentService.updatePaymentStatus(tranId, 'Failed');
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed?reason=${verification.failedreason}`,
      );
    }
  }

  @Public()
  @Post('ipn')
  async paymentIpn(@Body() body: any) {
    const { tran_id, status } = body;
    if (!tran_id || !status) return 'Invalid IPN';

    const verification = await this.paymentService.verifyPayment(tran_id);

    if (
      verification.status === 'VALID' ||
      verification.status === 'VALIDATED'
    ) {
      return this.paymentService.updatePaymentStatus(tran_id, 'Success');
    } else {
      return this.paymentService.updatePaymentStatus(tran_id, 'Failed');
    }
  }

  @Get('fail')
  async paymentFail(@Query('tran_id') tran_id: string) {
    return this.paymentService.updatePaymentStatus(tran_id, 'Failed');
  }

  @Get('cancel')
  async paymentCancel(@Query('tran_id') tran_id: string) {
    return this.paymentService.updatePaymentStatus(tran_id, 'Cancelled');
  }
}
