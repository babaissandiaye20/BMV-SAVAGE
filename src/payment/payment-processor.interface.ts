export interface PaymentProcessor {
  charge(
    amount: number,
    currency: string,
    paymentDetails: any
  ): Promise<{ transactionId: string; status: 'PAID' | 'FAILED' }>;

  refund(transactionId: string): Promise<boolean>;

  getTransactionDetails(transactionId: string): Promise<any>;

  createCheckoutSession?(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ): Promise<{ sessionId: string; url: string }>;
}
