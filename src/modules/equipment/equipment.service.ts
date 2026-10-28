import { EquipmentRepository } from "./equipment.repository";

export class EquipmentService {
  private readonly repository = new EquipmentRepository();

  public async getById(id: string) {
    const result = await this.repository.getById(id);

    return result;
  }

  public async getList() {
    const result = await this.repository.getList();

    return result;
  }
}
