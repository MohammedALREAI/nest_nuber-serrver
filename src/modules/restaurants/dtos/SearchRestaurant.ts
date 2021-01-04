import { PaginationInput, PaginationOutput } from "../../../common/dto/pagnataionDto";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Restaurants } from "../entity/restaurants.entity";

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field(() => String)
  query: string;
}
@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurants], { nullable: true })
  restaurants?: Restaurants[];
}
