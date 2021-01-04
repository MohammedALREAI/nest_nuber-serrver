import { ObjectType, PickType, Field } from "@nestjs/graphql";
import { Dish } from "../entity/dish.entity";
import { MutationOutput } from "../../../common/dto/MutationOutput";

@ObjectType()
export class CreateDishInputDto extends PickType(Dish, [
  "name",
  "price",
  "description",
  "options",
]) {
  @Field(() => String)
  restaurantId: string;
}

@ObjectType()
export class CreateDishOutputDto extends MutationOutput {}
