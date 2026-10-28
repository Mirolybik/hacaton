import { EquipmentRepository } from "./equipment.repository";

export class EquipmentService {
  private readonly repository = new EquipmentRepository();

  public getById(id: string) {
    return this.repository.getById(id);
  }

  public getList() {
    return this.repository.getList();
  }
}
