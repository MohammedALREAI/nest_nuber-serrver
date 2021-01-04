import { ArgsType, ObjectType, Field } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";
import { User } from "../entitty/user.entity";

@ArgsType()
export class UserProfileInput {
  @Field(() => String)
  userId: string;
}

@ObjectType()
export class UserProfileOutput extends MutationOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
c;
