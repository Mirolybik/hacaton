import { HttpError } from "../../lib/http-error";
import type {
  CreateRequestInput,
  ListRequestsQuery,
  UpdateRequestInput,
} from "./request.schema";
import { RequestRepository } from "./request.repository";
import { NotFoundError } from "../../errors/not-found,error";
import { AccessError } from "../../errors/access.error";
import { ConflictError } from "../../errors/conflict.error";
import { UserRole } from "../user/domains/user-role.enum";
import { RequestHistoryRepository } from "./request-history.repository";
import { sequelize } from "../../db";
import { Request } from "./domains/request.model";
import {
  REQUEST_STATUSES,
  STATUS_TRANSITIONS,
} from "./domains/request-info.types";
import { Equipment } from "../equipment/domains/equipment.model";

export type Role = "duty" | "engineer" | "director";

export type Actor = {
  name: string;
  role: Role;
};

const DIRECTOR_FIELDS = ["priority", "dueAt", "assignee"];
const ENGINEER_FIELDS = [
  "status",
  "diagnostics",
  "workDescription",
  "waitingComment",
  "closingComment",
];

export class RequestService {
  private readonly repository = new RequestRepository();
  private readonly historyRepository = new RequestHistoryRepository();

  public async getStats() {
    const requests = await Request.findAll();
    const byStatus: Record<string, number> = {};
    const byAssignee: Record<string, number> = {};
    let overdue = 0;
    for (const status of REQUEST_STATUSES) {
      byStatus[status] = 0;
    }
    for (const request of requests) {
      byStatus[request.status] += 1;
      if (request.overdue) {
        overdue += 1;
      }
      if (request.status !== "done") {
        const assignee = request.userId ?? "не назначен";
        byAssignee[assignee] = (byAssignee[assignee] ?? 0) + 1;
      }
    }
    return {
      total: requests.length,
      overdue,
      byStatus,
      byAssignee,
    };
  }

  public async create(data: CreateRequestInput, userId: string) {
    const equipment = await Equipment.findByPk(data.equipmentId);
    if (!equipment) {
      throw new NotFoundError("Оборудование не найдено");
    }

    let request: Request | null = null;
    await sequelize.transaction(async (t1) => {
      request = await this.repository.createRequest(data);
      await this.historyRepository.create(
        request.id,
        userId,
        "created",
        null,
        null,
        "Заявка создана",
      );
    });

    return request;
  }

  public async getById(id: string, userId: string) {
    const request = await this.repository.getRequest(id);
    if (!request) {
      throw new NotFoundError("Заявка не найдена!");
    }

    if (request.userId != userId) {
      throw new AccessError("Заявка назначена другому инженеру");
    }

    return request;
  }

  public async takeRequest(id: string, userId: string, userRole: UserRole) {
    const request = await this.repository.getRequest(id);
    if (!request) {
      throw new NotFoundError("Заявка не найдена!");
    }

    if (request.status === "done") {
      throw new ConflictError("Заявка уже выполнена");
    }

    if (request.userId && request.userId !== userId) {
      throw new ConflictError("Заявка уже назначена другому инженеру");
    }

    await sequelize.transaction(async (t1) => {
      await this.repository.updateRequestStatus(id, "new");

      const oldAssignee = request.userId;
      const oldStatus = request.status;

      await this.historyRepository.create(
        request.id,
        userId,
        "assigned",
        "assignee",
        oldAssignee,
        userId,
      );

      if (oldStatus !== request.status) {
        await this.historyRepository.create(
          request.id,
          userId,
          "status_changed",
          "status",
          oldStatus,
          request.status,
        );
      }
      request.status = "new";
    });

    return request;
  }

  public async getList(
    query: ListRequestsQuery,
    userRole: UserRole,
    userId: string,
  ) {
    return this.repository.getList(query, userRole, userId);
  }

  public async update(
    id: string,
    data: UpdateRequestInput,
    userId: string,
    userRole: UserRole,
  ) {
    const request = await this.repository.getRequest(id);
    if (!request) {
      throw new NotFoundError("Заявка не найдена!");
    }

    if (request.status === "done") {
      throw new ConflictError("Заявка уже выполнена");
    }

    if (userRole == UserRole.engineer && request.userId != userId) {
      throw new AccessError("Заявка назначена другому инженеру");
    }

    const allowedFields =
      userRole == UserRole.director ? DIRECTOR_FIELDS : ENGINEER_FIELDS;

    for (const field of Object.keys(data)) {
      if (!allowedFields.includes(field)) {
        throw new AccessError(`Нельзя менять поле ${field}`);
      }
    }

    if (data.status && data.status !== request.status) {
      if (!STATUS_TRANSITIONS[request.status].includes(data.status)) {
        throw new ConflictError(
          `Нельзя перейти из "${request.status}" в "${data.status}"`,
        );
      }

      if (data.status === "in_progress" && !(data.assignee ?? request.userId)) {
        throw new HttpError(400, "Сначала назначьте исполнителя");
      }

      if (
        data.status === "waiting_parts" &&
        !(data.waitingComment ?? request.waitingComment)
      ) {
        throw new HttpError(400, "Напишите, каких запчастей не хватает");
      }

      if (data.status === "done") {
        if (!(data.closingComment ?? request.closingComment)) {
          throw new HttpError(400, "Добавьте комментарий о результате");
        }

        if (
          request.type === "repair" &&
          !(data.workDescription ?? request.workDescription)
        ) {
          throw new HttpError(400, "Опишите выполненные работы");
        }
      }
    }

    for (const [field, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }

      const oldValue = request.get(field);

      if (String(oldValue) === String(value)) {
        continue;
      }

      // request.set(field, value);
      // await addHistory(
      //   request.id,
      //   actor,
      //   field === "status" ? "status_changed" : "updated",
      //   field,
      //   oldValue,
      //   value,
      // );
    }

    if (data.status === "done") {
      request.completedAt = new Date();
    }

    await request.save();
    return request;
  }
}
