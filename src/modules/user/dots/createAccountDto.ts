import { ObjectType, PickType, Field, InputType } from "@nestjs/graphql";
import { User } from "../entitty/user.entity";

@InputType()
export class CreateAccountInput extends PickType(User, ["email", "password", "role"]) {}

// result from the createAccount
@ObjectType()
export class CreateAccountTypeOutput {
  @Field(() => Boolean)
  ok: boolean;
  @Field(() => String, { nullable: true })
  error?: string;
}
