import { AppErrorOptions, ErrorDetails } from "./types/error-options.type";

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: ErrorDetails[];
  public readonly cause?: unknown;

  constructor(
    message: string,
    { status = 500, code = "ERROR", details = [], cause }: AppErrorOptions,
  ) {
    super(message, { cause });
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.details = details;
    this.cause = cause;
  }
}
