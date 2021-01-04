import { ObjectType, Field } from "@nestjs/graphql";
import { Category } from "../entity/Catogory.entity";
import { PaginationInput, PaginationOutput } from "../../../common/dto/pagnataionDto";

@ObjectType()
export class CategoryInput extends PaginationInput {
  @Field(() => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;
}
