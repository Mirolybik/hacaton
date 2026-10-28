import { EquipmentHistory } from "./domains/equipment-history.model";
import { Equipment } from "./domains/equipment.model";

export class EquipmentRepository {
  async getById(id: string): Promise<Equipment | null> {
    const result = await Equipment.findByPk(id, {
      include: [EquipmentHistory],
    });
    return result;
  }

  async getList(): Promise<Equipment[] | null> {
    const result = await Equipment.findAll({});

    return result;
  }
}
