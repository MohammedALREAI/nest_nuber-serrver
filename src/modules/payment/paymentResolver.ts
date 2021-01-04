import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { PaymentService } from "./paymrnt.service";
import { Payment } from "./entity/payment.entity";
import { CreatePaymentOutput, CreatePaymentInput } from "./dto/createPaymentDto";
import { User } from "../user/entitty/user.entity";
import { Role } from "../../common/decorator/role.decorator";
import { AuthUser } from "../../common/decorator/auth.decorator";
import { GetPaymentsOutput } from "./dto/getPayment";

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => CreatePaymentOutput)
  @Role(["Owner"])
  cretePayment(@AuthUser() user: User, @Args() args: CreatePaymentInput) {
    return this.paymentService.createPayment(user, args);
  }

  @Mutation(() => GetPaymentsOutput)
  @Role(["Owner"])
  getPayment(@AuthUser() user: User) {
    return this.paymentService.getPayment(user);
  }
}
