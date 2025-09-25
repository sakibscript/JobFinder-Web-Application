import { Controller, Post, Body, Get, Query, Res, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDTO } from 'src/DTOs/payment.dto';
import { Public } from 'src/Auth/public.decorator';
import { Response, Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() paymentData: PaymentDTO) {
    return await this.paymentService.initiatePayment(paymentData);
  }

  @Public()
  @Post('success')
  async paymentSuccess(@Body() body: any, @Res() res: Response) {
    try {
      const tranId = body.tran_id || body.transaction_id;

      if (!tranId) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment-failed?reason=no_transaction_id`,
        );
      }

      await this.paymentService.updatePaymentStatus(
        tranId,
        'success',
        body.bank_tran_id,
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?payment=success&transaction_id=${tranId}`,
      );
    } catch (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed?reason=server_error`,
      );
    }
  }

  @Public()
  @Post('fail')
  async paymentFail(@Body() body: any, @Res() res: Response) {
    const tranId = body.tran_id || body.transaction_id;
    if (tranId) {
      await this.paymentService.updatePaymentStatus(tranId, 'failed');
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failed?reason=payment_declined&transaction_id=${tranId || 'unknown'}`,
    );
  }

  @Public()
  @Post('cancel')
  async paymentCancel(@Body() body: any, @Res() res: Response) {
    const tranId = body.tran_id || body.transaction_id;
    if (tranId) {
      await this.paymentService.updatePaymentStatus(tranId, 'cancelled');
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-cancelled?transaction_id=${tranId || 'unknown'}`,
    );
  }

  @Public()
  @Post('ipn')
  async paymentIpn(@Body() body: any, @Res() res: Response) {
    try {
      const { tran_id, status, bank_tran_id } = body;

      if (tran_id && status) {
        await this.paymentService.updatePaymentStatus(
          tran_id,
          status.toLowerCase(),
          bank_tran_id,
        );
      }

      return res.status(200).send('IPN processed');
    } catch (error) {
      console.error('IPN processing error:', error);
      return res.status(500).send('IPN processing failed');
    }
  }

  @Public()
  @Get('test-success')
  async testSuccessRedirect(
    @Query('tran_id') tranId: string,
    @Res() res: Response,
  ) {
    if (!tranId) {
      tranId = 'TEST_' + Date.now();
    }

    await this.paymentService.updatePaymentStatus(tranId, 'success');
    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?payment=success&transaction_id=${tranId}`,
    );
  }

  @Public()
  @Get('test-fail')
  async testFailRedirect(
    @Query('tran_id') tranId: string,
    @Res() res: Response,
  ) {
    if (tranId) {
      await this.paymentService.updatePaymentStatus(tranId, 'failed');
    }
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failed?reason=test_failure&transaction_id=${tranId || 'test'}`,
    );
  }
}
