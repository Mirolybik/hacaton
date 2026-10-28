import { Router } from "express";
import { RequestController } from "./request.controller";
import { checkAccess } from "../../middlewares/access.middleware";
import { UserRole } from "../user/domains/user-role.enum";
import { validate } from "../../middlewares/validator.middleware";
import {
  createRequestSchema,
  listRequestsQuerySchema,
  updateRequestSchema,
} from "./request.schema";

export const requestRouter = Router();
const controller = new RequestController();

requestRouter.post(
  "/",
  checkAccess([UserRole.duty]),
  validate({ body: createRequestSchema }),
  controller.create,
);

requestRouter.get("/:id", controller.getById);
requestRouter.patch(
  "/:id",
  checkAccess([UserRole.engineer, UserRole.director]),
  validate({ body: updateRequestSchema }),
  controller.update,
);

requestRouter.get(
  "/stats",
  checkAccess([UserRole.director]),
  controller.getStats,
);
requestRouter.get(
  "/",
  validate({ query: listRequestsQuerySchema }),
  controller.getList,
);

requestRouter.post(
  "/:id/take",
  checkAccess([UserRole.engineer]),
  controller.take,
);
