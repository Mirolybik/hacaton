import { randomUUID } from "crypto";
import { RequestHistory } from "./domains/request-history.model";
import { RequestStatus } from "./domains/request-info.types";
import { Request } from "./domains/request.model";
import {
  CreateRequestInput,
  ListRequestsQuery,
  UpdateRequestInput,
} from "./request.schema";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../user/domains/user-role.enum";
import { Op } from "sequelize";

export class RequestRepository {
  public async getRequest(id: string): Promise<Request | null> {
    const result = await Request.findByPk(id, {
      include: [{ model: RequestHistory, as: "history" }],
    });

    return result;
  }

  public async getList(
    query: ListRequestsQuery,
    userRole: UserRole,
    userId: string,
  ) {
    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.type) {
      where.type = query.type;
    }
    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.assignee) {
      where.assignee = query.assignee;
    }
    if (query.equipmentId) {
      where.equipmentId = query.equipmentId;
    }
    if (userRole == UserRole.engineer) {
      where[Op.or] = [{ assignee: null }, { assignee: userId }];
    }
    return Request.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
  }

  public async createRequest(data: CreateRequestInput): Promise<Request> {
    const result = await Request.create({
      id: uuidv4(),
      status: "new",
      type: data.type,
      equipmentId: data.equipmentId,
      description: data.description,
      priority: data.priority,
      authorName: data.authorName,
      authorContact: data.authorContact,
      dueAt: data.dueAt,
    });
    return result;
  }

  public async updateRequestStatus(id: string, newStatus: RequestStatus) {
    await Request.update({ status: newStatus }, { where: { id: id } });
  }

  public async updateRequest(id: string, data: UpdateRequestInput) {
    const request = await Request.findByPk(id);

    if (request) {
      for (const [field, value] of Object.entries(data)) {
        if (value === undefined) continue;
        request.set(field as any, value);
      }

      if (data.status === "done") {
        request.completedAt = new Date();
      }
      await request?.save();
    }
  }
}
