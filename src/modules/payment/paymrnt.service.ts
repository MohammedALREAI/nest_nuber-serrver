import { Injectable } from "@nestjs/common";
import { Payment } from "./entity/payment.entity";
import { Repository } from "typeorm";
import { User } from "../user/entitty/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePaymentOutput, CreatePaymentInput } from "./dto/createPaymentDto";
import { RestaurantRepository } from "../restaurants/Repository/restaurants.repository";
import { GetPaymentsOutput } from "./dto/getPayment";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    private readonly restaurantRepo: RestaurantRepository,
  ) {}

  async createPayment(user: User, args: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const { restaurantId: id, transactionId } = args;
    const { restaurant: restaurants, error, ok } = await this.restaurantRepo.findOneRestaurant(id);
    if (!restaurants) {
      return {
        ok,
        error,
      };
    }
    if (restaurants.ownerId !== user.id) {
      return {
        ok,
        error: "you not Authorization to access to this section ",
      };
    }

    try {
      const pay = new Payment();
      pay.user = user;
      pay.restaurant = restaurants;
      pay.transactionId = transactionId;
      await this.paymentRepo.save(pay);
    } catch (e) {
      return {
        ok,
        error: "you not Authorization to access to this section ",
      };
    }
  }

  async getPayment(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.paymentRepo.find(user);
      if (!payments) {
        return {
          ok: false,
          error: "you cant complate this session",
        };
      }
      return {
        ok: true,
        payments,
      };
    } catch (e) {}
  }
}
