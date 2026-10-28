import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";
import { AppError } from "../errors/app.error";
import { ErrorResponse } from "../errors/types/error-options.type";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    let errorResponse = ErrorResponse.create(err);

    logger[err.status >= 500 ? "error" : "warn"](
      { error: err },
      "request failed",
    );

    res
      .status(err.status)
      .type("application/problem+json")
      .json({ error: errorResponse });
  } else {
    logger.error(err);

    let status = 500;

    let body = {
      error: {
        message: "Server problem",
      },
    };

    if (err instanceof Error && err.name.startsWith("Sequelize")) {
      status = 503;
      body.error.message = "Database connection problem";
    }

    res.status(status).type("application/problem+json").json({ error: body });
  }
}
