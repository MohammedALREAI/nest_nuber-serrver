import { PaginationInput, PaginationOutput } from "../../../common/dto/pagnataionDto";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Restaurants } from "../entity/restaurants.entity";

@InputType()
export class SingleRestaurantInput extends PaginationInput {
  @Field(() => String)
  id: string;
}
@ObjectType()
export class SingleRestaurantOutput extends PaginationOutput {
  @Field(() => Restaurants, { nullable: true })
  restaurant?: Restaurants;
}
