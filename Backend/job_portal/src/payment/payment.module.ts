import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/Entities/payment.entity';
import { Subscription } from 'src/Entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Subscription])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
