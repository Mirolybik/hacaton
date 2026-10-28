import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes";
import { authRouter } from "../modules/user/auth.routes";
import { requestRouter } from "../modules/requests/request.routes";
import { authenticate } from "../middlewares/auth.middleware";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/request", authenticate, requestRouter);
