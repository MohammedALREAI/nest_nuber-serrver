import { PickType, InputType, ObjectType } from "@nestjs/graphql";
import { Order } from "../entity/order.entity";
@InputType()
export class GetOrderInput extends PickType(Order, ["id"]) {}

@ObjectType()
export class OrderUpdatesInput extends PickType(Order, ["id"]) {}
