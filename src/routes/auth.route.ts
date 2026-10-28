import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const controller = new AuthController();
export const authRouter = Router();

authRouter.post("/login", controller.login);
authRouter.post("/logout", controller.logout);
