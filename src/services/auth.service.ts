import { env } from "../config/env";
import { AuthenticationError } from "../errors/authentication.error";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const repository = new UserRepository();

export class AuthService {
  public async login(email: string, password: string): Promise<string> {
    const userInfo = await repository.getByEmail(email);

    if (!userInfo) {
      throw new AuthenticationError("Неверные данные для входа");
    }

    const isCorrectPassword = await bcrypt.compare(password, userInfo.password);
    if (!isCorrectPassword) {
      throw new AuthenticationError("Неверные данные для входа");
    }

    return this.createJwt(userInfo);
  }

  public async logout() {}

  private createJwt(payload?: any): string {
    return jwt.sign(payload, env.JWT_SECRET_KEY, {
      expiresIn: env.JWT_MAX_AGE_S,
    });
  }
}
