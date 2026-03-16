declare module '@paystack/inline-js' {
  interface PaystackTransaction {
    reference: string;
    trans: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
  }

  interface ResumeTransactionCallbacks {
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
    onLoad?: (response: unknown) => void;
    onError?: (error: unknown) => void;
  }

  interface NewTransactionOptions extends ResumeTransactionCallbacks {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
  }

  class PaystackPop {
    resumeTransaction(accessCode: string, callbacks?: ResumeTransactionCallbacks): void;
    newTransaction(options: NewTransactionOptions): void;
    cancelTransaction(): void;
  }

  export default PaystackPop;
}
