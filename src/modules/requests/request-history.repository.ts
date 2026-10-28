import { UserRole } from "../user/domains/user-role.enum";
import { RequestHistory } from "./domains/request-history.model";
import { Request } from "./domains/request.model";
import { CreateRequestInput } from "./request.schema";

export class RequestHistoryRepository {
  public async create(
    requestId: string,
    action: string,
    authorId: string,
    field: string | null,
    oldValue: unknown,
    newValue: unknown,
  ) {
    RequestHistory.create({
      requestId,
      authorId: authorId,
      action,
      field,
      oldValue: oldValue == null ? null : String(oldValue),
      newValue: newValue == null ? null : String(newValue),
    });
  }
}
