import { MutationOutput } from "../../../common/dto/MutationOutput";
import { PickType, InputType, ObjectType, Field } from "@nestjs/graphql";
import { Order } from "../entity/order.entity";
@InputType()
export class GetOrderInput extends PickType(Order, ["id"]) {}

@ObjectType()
export class GetOrderOutput extends MutationOutput {
  @Field(() => Order, { nullable: true })
  order?: Order;
}
