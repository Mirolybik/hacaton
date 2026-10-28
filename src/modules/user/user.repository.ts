import { User } from "./domains/user.model";
import { UserInfoDto } from "./dto/user.dto";

export class UserRepository {
  public async getByEmail(email: string): Promise<UserInfoDto | null> {
    const result = (await User.findOne({
      where: { email: email },
      attributes: ["id", "email", "password", "role", ["shortName", "name"]],
    })) as unknown as UserInfoDto;

    return result;
  }
}
