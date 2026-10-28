import { Router } from "express";
import { EquipmentController } from "./equipment.controller";
import { checkAccess } from "../../middlewares/access.middleware";
import { UserRole } from "../user/domains/user-role.enum";

export const equipmentRouter = Router();
const controller = new EquipmentController();

equipmentRouter.get(
  "/:id",
  checkAccess([UserRole.director]),
  controller.getById,
);
equipmentRouter.get("/", checkAccess([UserRole.director]), controller.get);
