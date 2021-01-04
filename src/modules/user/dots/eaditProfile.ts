import { InputType, PickType, ObjectType, PartialType } from "@nestjs/graphql";
import { CreateAccountInput } from "./createAccountDto";
import { MutationOutput } from "../../../common/dto/MutationOutput";

// input and output
@InputType()
export class EditProfileInputMutation extends PartialType(
  PickType(CreateAccountInput, ["password", "email"]),
) {}

@ObjectType()
export class EditProfileOutputMutation extends MutationOutput {}
