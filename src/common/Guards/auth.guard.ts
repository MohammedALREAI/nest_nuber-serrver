import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AllowRoles } from "../decorator/role.decorator";
import { JwtService } from "../../modules/jwt/jwt.service";
import { UserService } from "../../modules/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<AllowRoles>("roles", context.getHandler());
    if (!role) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (!token) {
      return false;
    }
    const decode = this.jwtService.verify(token.toString());
    if (typeof decode === "object" && decode.hasOwnProperty("id")) {
      const { user } = await this.userService.findUserById(decode["id"]);

      if (!user) {
        return false;
      }
      if (user.role.includes("Any")) {
        return true;
      }
      return role.includes(user.role);
    }
  }
}
