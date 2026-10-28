import { AppError } from "./app.error.js";
import { ErrorDetails } from "./types/error-options.type.js";

export class AuthenticationError extends AppError {
  constructor(message: string, details?: ErrorDetails[]) {
    super(message, {
      status: 401,
      code: "AUTHENTICATION_ERROR",
      details: details,
    });
  }
}
