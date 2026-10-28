import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app.error.js";
import { AuthenticationError } from "../errors/authentication.error.js";
import { env } from "../config/env.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req?.cookies?.accessToken;
  if (!token) {
    return next(new AuthenticationError("Токен не предоставлен"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY);

    res.locals.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError("Невалидный токен"));
  }
}
