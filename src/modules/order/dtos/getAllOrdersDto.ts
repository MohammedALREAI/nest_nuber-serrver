import { MutationOutput } from "../../../common/dto/MutationOutput";
import { InputType, ObjectType, Field } from "@nestjs/graphql";
import { OrderStatus } from "../enum/EnumOrderStaus";
import { Order } from "../entity/order.entity";

@InputType()
export class GetOrdersInput {
  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;
}

@ObjectType()
export class GetOrdersOutput extends MutationOutput {
  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
