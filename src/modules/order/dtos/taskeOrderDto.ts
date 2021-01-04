import { MutationOutput } from "../../../common/dto/MutationOutput";
import { PickType, InputType, ObjectType } from "@nestjs/graphql";
import { Order } from "../entity/order.entity";
@InputType()
export class TakeOrderInput extends PickType(Order, ["id"]) {}

@ObjectType()
export class TakeOrderOutput extends MutationOutput {}
