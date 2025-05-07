export class CreatePaymentDto {
  userId: string;
  appointmentId: string;
  paymentModeId: string;
  amount: number;
  currency: string;
  paymentDetails: {
    paymentMethodId: string;
  };
}
