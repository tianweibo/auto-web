export interface HttpType {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  params?: Record<string, any>;
  data?: Record<string, any>;
}

export interface responseDataType<T = Record<string, any>> {
  code: number;
  msg: string;
  data: T;
}
