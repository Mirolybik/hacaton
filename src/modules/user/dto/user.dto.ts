import { UserRole } from "../domains/user-role.enum";

export interface UserInfoDto {
  password: string;
  id: string;
  role: UserRole;
}
