import { NextFunction } from "express";
import { ZodType } from "zod/v4";
import { Request, Response } from "express";
import { ValidationError } from "../errors/validation.error";

export interface RequestValidatorSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export function validate(schemas: RequestValidatorSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const part of ["body", "query", "params"] as const) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part]);
      if (!result.success) {
        return next(new ValidationError(result.error));
      }
      if (part == "query") {
        res.locals.query = result.data;
      } else {
        req[part] = result.data;
      }
    }
    next();
  };
}
