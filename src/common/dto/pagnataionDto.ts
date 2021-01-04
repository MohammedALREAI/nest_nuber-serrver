import { InputType, Field, Int, ObjectType } from "@nestjs/graphql";
import { MutationOutput } from "./MutationOutput";

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;
}

@ObjectType()
export class PaginationOutput extends MutationOutput {
  @Field(() => Int, { nullable: true })
  totalPage?: number;
  @Field(() => Int, { nullable: true })
  totalItems?: number;
}
