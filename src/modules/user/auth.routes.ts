import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { loginSchema } from "./auth.schemas";
import { validate } from "../../middlewares/validator.middleware";

const controller = new AuthController();
export const authRouter = Router();

authRouter.post("/login", validate({ body: loginSchema }), controller.login);
authRouter.post("/logout", authenticate, controller.logout);
