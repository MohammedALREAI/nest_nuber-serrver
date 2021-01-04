import { InputType, ObjectType, Field } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";
import { User } from "../entitty/user.entity";

// input and output
@InputType()
export class GetUserIDInputMutation {
  @Field(() => String)
  id: string;
}

@ObjectType()
export class GetUserIDOutputMutation extends MutationOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
