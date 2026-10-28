import { Request, Response, NextFunction } from "express";
import { UserRole } from "../domains/enums/user-role.enum.js";
import { UserInfoDto } from "../dto/user.dto.js";
import { AccessError } from "../errors/access.error.js";

export function checkAccess(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user as UserInfoDto;
      if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return next(new AccessError("Недостаточно прав"));
      }

      next();
    } catch (error) {
      return next(new AccessError("Нет доступа"));
    }
  };
}
