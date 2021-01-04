import { Request, Response } from "express";
import { User } from "../../modules/user/entitty/user.entity";

export interface IContext {
  req: Request;
  res: Response;
}

export interface IContextOutput {
  user: User;
}
