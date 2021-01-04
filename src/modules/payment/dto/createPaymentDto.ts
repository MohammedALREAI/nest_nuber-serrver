import { ObjectType, InputType, PickType } from "@nestjs/graphql";
import { MutationOutput } from "../../../common/dto/MutationOutput";
import { Payment } from "../entity/payment.entity";

@InputType()
export class CreatePaymentInput extends PickType(Payment, ["transactionId", "restaurantId"]) {}

@ObjectType()
export class CreatePaymentOutput extends MutationOutput {}
