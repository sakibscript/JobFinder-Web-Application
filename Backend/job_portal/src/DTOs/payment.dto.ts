import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentDTO {
  @IsNotEmpty()
  @IsNumber()
  jobSeekerId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  readonly paymentMethod?: string;
}
