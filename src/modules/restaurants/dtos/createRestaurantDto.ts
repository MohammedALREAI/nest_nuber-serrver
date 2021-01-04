import { InputType, ObjectType, PickType, Field } from "@nestjs/graphql";
import { Restaurants } from "../entity/restaurants.entity";
import { MutationOutput } from "../../../common/dto/MutationOutput";
@InputType()
export class CreateRestaurantInputType extends PickType(Restaurants, [
  "name",
  "coverImage",
  "address",
]) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutputType extends MutationOutput {}
