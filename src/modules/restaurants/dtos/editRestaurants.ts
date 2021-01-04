import { InputType, PartialType, Field, ObjectType } from "@nestjs/graphql";
import { Restaurants } from "../entity/restaurants.entity";
import { MutationOutput } from "../../../common/dto/MutationOutput";
@InputType()
export class EditRestaurantInputType extends PartialType(Restaurants) {
  @Field(() => String)
  categoryName: string;
}
@ObjectType()
export class EditRestaurantOutputMutation extends MutationOutput {}
