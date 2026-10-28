import { Equipment } from "../modules/equipment/domains/equipment.model.js";
import { EquipmentHistory } from "../modules/equipment/domains/equipment-history.model.js";
import { RequestHistory } from "../modules/requests/domains/request-history.model.js";
import { User } from "../modules/user/domains/user.model.js";
import { Request } from "../modules/requests/domains/request.model.js";

export const modelsList = [
  User,
  Equipment,
  EquipmentHistory,
  Request,
  RequestHistory,
] as const;
