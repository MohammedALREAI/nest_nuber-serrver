import { InputType, ObjectType, Field } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";
@InputType()
export class DeleteRestaurantInputType {
  @Field(() => String)
  id: string;
}

@ObjectType()
export class DeleteRestaurantOutputType extends MutationOutput {}
