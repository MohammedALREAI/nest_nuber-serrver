import { Module } from "@nestjs/common";
import { PaymentService } from "./paymrnt.service";
import { PaymentResolver } from "./paymentResolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entity/payment.entity";
import { RestaurantRepository } from "../restaurants/Repository/restaurants.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, RestaurantRepository])],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentModule {}
