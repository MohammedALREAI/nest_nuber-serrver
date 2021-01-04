import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "../jwt.service";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ("x-jwt" in req.header) {
      const token = req.header["x-jwt"];
      const decoded = this.jwtService.verify(token);
      if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
        try {
          const user = await this.userService.findUserById(decoded["id"]);
          req["user"] = user;
        } catch (e) {}
      }
    }
    next();
  }
}
