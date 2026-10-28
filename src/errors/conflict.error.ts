import { AppError } from "./app.error.js";
import { ErrorDetails } from "./types/error-options.type.js";

export class ConflictError extends AppError {
  constructor(message: string, details?: ErrorDetails[]) {
    super(message, { status: 409, code: "CONFLICT_ERROR", details: details });
  }
}
