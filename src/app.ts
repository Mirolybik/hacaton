import express from "express";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { notFound } from "./middlewares/not-found";
import { logger } from "./lib/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.FRONT_CORS,
      credentials: true,
    }),
  );

  app.use((req, _res, next) => {
    logger.info({ method: req.method, url: req.url }, "request");
    next();
  });

  app.use("/api", apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
