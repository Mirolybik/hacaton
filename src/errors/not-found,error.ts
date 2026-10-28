import { AppError } from "./app.error.js";
import { ErrorDetails } from "./types/error-options.type.js";

export class NotFoundError extends AppError {
  constructor(message = "Не найден", details?: ErrorDetails[]) {
    super(message, { status: 404, code: "NOT_FOUND", details: details });
  }
}
