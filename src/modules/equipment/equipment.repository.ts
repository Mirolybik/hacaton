import { Equipment } from "./domains/equipment.model";

export class EquipmentRepository {
  public async createEquipments(equipments: any) {
    await Equipment.bulkCreate(equipments);
  }
}
