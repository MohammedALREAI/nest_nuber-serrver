import { MutationOutput } from "../../../common/dto/MutationOutput";
import { ObjectType, Field } from "@nestjs/graphql";
import { Payment } from "../entity/payment.entity";
@ObjectType()
export class GetPaymentsOutput extends MutationOutput {
  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}
