import { UserRole } from "../domains/enums/user-role.enum";

export interface UserInfoDto {
  password: string;
  name: string;
  id: string;
  role: UserRole;
}
