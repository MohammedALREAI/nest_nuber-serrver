import { UserType } from "../../modules/user/enum/IUserType";
import { SetMetadata } from "@nestjs/common";

export type AllowRoles = keyof typeof UserType | "Any";

export const Role = (roles: AllowRoles[]) => SetMetadata("roles", roles);
