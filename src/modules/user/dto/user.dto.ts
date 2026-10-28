import { UserRole } from "../domains/user-role.enum";

export interface UserInfoDto {
  password: string;
  name: string;
  id: string;
  role: UserRole;
}
