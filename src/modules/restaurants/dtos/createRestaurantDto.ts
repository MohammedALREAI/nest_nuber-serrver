import { InputType, OmitType } from "@nestjs/graphql";
import { Restaurants } from "../entity/restaurants.entity";
@InputType()
export class CreateRestaurantDto extends OmitType(Restaurants, ["id"], InputType) {}
// the third args it ude to remove the conflext with the input type
