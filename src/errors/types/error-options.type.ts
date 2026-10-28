import { AppError } from "../app.error";

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

export class ErrorResponse {
  code?: string;
  message?: string;
  details?: ErrorDetails[];
  requestId?: string;

  static create(errorInfo: AppError): ErrorResponse {
    const instanse = new ErrorResponse();
    instanse.code = errorInfo.code;
    instanse.message = errorInfo.message;

    if (errorInfo.details.length > 0) {
      instanse.details = [];

      errorInfo.details.map((info) => {
        instanse.details?.push({
          field: info.field,
          message: info.message,
        });
      });
    }

    return instanse;
  }
}
