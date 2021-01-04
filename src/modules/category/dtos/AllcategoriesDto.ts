import { ObjectType, InputType, Field } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";
import { Category } from "../entity/Catogory.entity";

InputType();
export class AllCategoriesInputQuery {}

ObjectType();
export class AllCategoriesOutputQuery extends MutationOutput {
  @Field(() => [Category], { nullable: true })
  categories: Category[];
}
