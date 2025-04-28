export interface Response<T> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: string[];
  timestamp?: string;
  path?: string;
}
