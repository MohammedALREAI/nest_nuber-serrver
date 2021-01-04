import { Injectable, Inject } from "@nestjs/common";
import { IJwtOption } from "./interface/IJwtOptions";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
  constructor(@Inject("CONFIG_OPTION") private readonly options: IJwtOption) {}
  sign(userId: string): string {
    return jwt.sign({ id: userId }, this.options.secretKey);
  }
  verify(token: string) {
    return jwt.verify(token, this.options.secretKey);
  }
}
