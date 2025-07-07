export class SSLCommerzSuccessDto {
  readonly val_id: string;
  readonly amount: string;
  readonly card_type: string;
  readonly store_amount: string;
  readonly card_no: string;
  readonly bank_tran_id: string;
  readonly status: string;
  readonly tran_date: string;
  readonly currency: string;
  readonly card_issuer: string;
  readonly card_brand: string;
  readonly verify_sign: string;
  readonly verify_key: string;
  readonly cus_email: string;
  readonly cus_name: string;
  readonly value_a: string; // jobSeekerId
  readonly value_b: string; // subscriptionId
}

export class SSLCommerzFailDto {
  readonly val_id: string;
  readonly amount: string;
  readonly tran_date: string;
  readonly error: string;
}

export class SSLCommerzCancelDto {
  readonly val_id: string;
  readonly amount: string;
  readonly tran_date: string;
}
