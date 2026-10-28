export interface ErrorDetails {
  field: string;
  code?: string;
  message: string;
}

export interface AppErrorOptions {
  status?: number;
  code?: string;
  details?: ErrorDetails[];
  cause?: unknown;
}
