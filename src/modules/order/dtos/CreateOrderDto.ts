import { ObjectType, Field, InputType, Int } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";
import { OrderItemOption } from "../entity/OrderItem.entity";

@InputType()
class CreateOrderItemInput {
  @Field(() => String)
  dishId: string;

  @Field(() => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  restaurantId: string;

  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends MutationOutput {
  @Field(() => Int, { nullable: true })
  orderId?: number;
}
