import { ObjectType, PickType, Field } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";
import { CreateDishInputDto } from "./createDishDto";

@ObjectType()
export class EditDishInputDto extends PickType(CreateDishInputDto, ["restaurantId"]) {
  @Field(() => String)
  id: string;
}

@ObjectType()
export class EditDishOutputDto extends MutationOutput {}
