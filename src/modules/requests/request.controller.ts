import { Request, Response } from "express";
import { RequestService } from "./request.service";
import { User } from "../user/domains/user.model";

export class RequestController {
  private readonly service = new RequestService();

  public create = async (req: Request, res: Response) => {
    const request = await this.service.create(req.body, res.locals.user.id);

    res.status(201).json(request);
  };

  public getById = async (req: Request, res: Response) => {
    const request = await this.service.getById(
      req.params.id,
      res.locals.user.id,
    );
    res.json(request);
  };

  public update = async (req: Request, res: Response) => {
    const request = await this.service.update(
      req.params.id,
      req.body,
      res.locals.user.id,
      res.locals.user.role,
    );
    res.json(request);
  };

  public getStats = async (req: Request, res: Response) => {
    const result = await this.service.getStats();
    res.json(result);
  };

  public getList = async (req: Request, res: Response) => {
    const result = await this.service.getList(
      res.locals.query,
      res.locals.user.role,
      res.locals.user.id,
    );
    res.json(result);
  };

  public take = async (req: Request, res: Response) => {
    const result = await this.service.takeRequest(
      req.params.id,
      res.locals.user.id,
      res.locals.user.role,
    );
    res.json(result);
  };
}
