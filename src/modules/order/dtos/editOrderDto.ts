import { MutationOutput } from "../../../common/dto/MutationOutput";
import { PickType, InputType, ObjectType } from "@nestjs/graphql";
import { Order } from "../entity/order.entity";

@InputType()
export class EditOrderInput extends PickType(Order, ["id", "status"]) {}

@ObjectType()
export class EditOrderOutput extends MutationOutput {}
