import { InputType, PickType, ObjectType, Field } from "@nestjs/graphql";
import { CreateAccountInput } from "./createAccountDto";
import { MutationOutput } from "../../../common/dto/MutationOutput";

// input and output
@InputType()
export class LoginInputMutation extends PickType(CreateAccountInput, ["email", "password"]) {}

@ObjectType()
export class LoginOutputMutation extends MutationOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
