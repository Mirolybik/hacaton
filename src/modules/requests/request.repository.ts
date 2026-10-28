import { RequestHistory } from "./domains/request-history.model";
import { RequestStatus } from "./domains/request-info.types";
import { Request } from "./domains/request.model";
import { CreateRequestInput } from "./request.schema";

export class RequestRepository {
  public async getRequest(id: string): Promise<Request | null> {
    const result = await Request.findByPk(id, {
      include: [{ model: RequestHistory, as: "history" }],
    });

    return result;
  }

  public async createRequest(data: CreateRequestInput): Promise<Request> {
    // const result = await Request.create({
    //   type: data.type,
    //   equipmentId: data.equipmentId,
    //   description: data.description,
    //   priority: data.priority,
    //   authorName: data.authorName,
    //   authorContact: data.authorContact,
    //   dueAt: data.dueAt,
    // });
    return result;
  }

  public async updateRequestStatus(id: string, newStatus: RequestStatus) {
    await Request.update({ status: newStatus }, { where: { id: id } });
  }
}
