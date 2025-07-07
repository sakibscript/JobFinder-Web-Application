import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDTO } from 'src/DTOs/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() paymentData: PaymentDTO) {
    return await this.paymentService.initiatePayment(paymentData);
  }

  @Get('success')
  async paymentSuccess(@Query('tran_id') tran_id: string) {
    const result = await this.paymentService.updatePaymentStatus(
      tran_id,
      'Success',
    );
    return { message: 'Payment successful', details: result };
  }

  @Get('fail')
  async paymentFail(@Query('tran_id') tran_id: string) {
    const result = await this.paymentService.updatePaymentStatus(
      tran_id,
      'Failed',
    );
    return { message: 'Payment failed', details: result };
  }

  @Get('cancel')
  async paymentCancel(@Query('tran_id') tran_id: string) {
    const result = await this.paymentService.updatePaymentStatus(
      tran_id,
      'Cancelled',
    );
    return { message: 'Payment cancelled', details: result };
  }
}
