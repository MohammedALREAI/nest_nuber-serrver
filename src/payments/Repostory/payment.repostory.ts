import { Payment } from "../entities/payment.entity";
import { EntityRepository, Repository, LessThan } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "../../restaurants/entities/restaurant.entity";
import { CreatePaymentInput, CreatePaymentOutput } from "../dtos/create-payment.dto";
import { GetPaymentsOutput } from "../dtos/get-payments.dto";
import { User } from "../../users/entities/user.entity";
import { EnumPaymentError } from "../Enum/errorPaymentsEnum";

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantsRepo: Repository<Restaurant>,
  ) {
    super();
  }
  async createPayment(owner: User, args: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const { transactionId, restaurantId } = args;
    try {
      const restaurant = await this.restaurantsRepo.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found.",
        };
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: EnumPaymentError.NOT_AUTHORIZE,
        };
      }
      await this.save(
        this.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );
      restaurant.isPromoted = true;
      const date = new Date();
      date.setDate(date.getDate() + 7);
      restaurant.promotedUntil = date;
      this.restaurantsRepo.save(restaurant);
      return {
        ok: true,
      };
    } catch {
      return { ok: false, error: EnumPaymentError.PAYMENT_ERROR };
    }
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.find({ user: user });
      if (!payments) {
        return {
          ok: false,
          error: EnumPaymentError.PAYMENT_NOT_FOUND,
        };
      }
      return {
        ok: true,
        payments,
      };
    } catch {
      return {
        ok: false,
        error: "Could not load payments.",
      };
    }
  }

  async checkPromotedRestaurants() {
    const restaurants = await this.restaurantsRepo.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date()),
    });
    console.log(restaurants);
    restaurants.forEach(async restaurant => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurantsRepo.save(restaurant);
    });
  }
}
