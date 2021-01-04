import { PaginationInput, PaginationOutput } from "../../../common/dto/pagnataionDto";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Restaurants } from "../entity/restaurants.entity";

@InputType()
export class RestaurantInput extends PaginationInput {}
@ObjectType()
export class RestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurants], { nullable: true })
  restaurants?: Restaurants[];
}
