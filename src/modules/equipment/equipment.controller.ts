import { Request, Response } from "express";
import { EquipmentService } from "./equipment.service";

export class EquipmentController {
  private readonly service = new EquipmentService();

  public getById = async (req: Request, res: Response) => {
    const { id } = req.body;
    const result = await this.service.getById(id);

    res.status(200).json(result);
  };

  public get = async (req: Request, res: Response) => {
    const result = await this.service.getList();

    res.status(200).json(result);
  };
}
