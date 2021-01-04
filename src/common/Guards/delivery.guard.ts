import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AllowRoles } from "../decorator/role.decorator";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "../../modules/user/entitty/user.entity";
import { UserType } from "../../modules/user/enum/IUserType";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<AllowRoles[]>("roles", context.getHandler());
    if (!role) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext["user"];
    if (!user) {
      return false;
    }
    return user.role.includes(UserType.DELIVERY);
  }
}
