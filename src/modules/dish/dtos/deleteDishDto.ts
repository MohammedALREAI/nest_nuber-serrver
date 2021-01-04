import { ObjectType, Field } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";

@ObjectType()
export class DeleteDishInputDto {
  @Field(() => String)
  id: string;
}

@ObjectType()
export class DeleteDishOutputDto extends MutationOutput {}
