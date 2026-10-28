import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { env } from "../../config/env";

export class AuthController {
  private readonly authService = new AuthService();

  public login = async (req: Request, res: Response) => {
    const { login, password } = req.body;
    const result = await this.authService.login(login, password);

    res.cookie("accessToken", result, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: env.JWT_MAX_AGE_S * 1000,
    });

    return res.status(200).send();
  };

  public logout = async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
  };
}
