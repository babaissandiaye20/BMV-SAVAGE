export interface SmsServiceInterface {
  sendOtp(phone: string): Promise<any>;
  verifyOtp(phone: string, code: string): Promise<any>;
}
export const SMS_SERVICE = 'SmsServiceInterface';
