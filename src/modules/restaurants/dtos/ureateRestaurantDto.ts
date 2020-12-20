import { CreateRestaurantDto } from "./createRestaurantDto";
import { InputType, PartialType } from "@nestjs/graphql";
@InputType()
export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
