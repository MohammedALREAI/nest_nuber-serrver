import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { CreatePaymentInput, CreatePaymentOutput } from "./dtos/create-payment.dto";
import { GetPaymentsOutput } from "./dtos/get-payments.dto";
import { PaymentRepository } from "./Repostory/payment.repostory";

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepository) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    return await this.paymentRepo.createPayment(owner, { transactionId, restaurantId });
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    return await this.paymentRepo.getPayments(user);
  }

  async checkPromotedRestaurants() {
    return await this.paymentRepo.checkPromotedRestaurants();
  }
}
