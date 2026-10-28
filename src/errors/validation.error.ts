import { AppError } from "./app.error.js";
import { ZodError } from "zod/v4";

export class ValidationError extends AppError {
  constructor(zodError: ZodError) {
    super("Ошибка валидации", {
      status: 400,
      code: "VALIDATION_ERROR",
      details: zodError.issues.map((i) => ({
        field: i.path.join(".") || "()",
        code: i.code,
        message: i.message,
      })),
    });
  }
}
