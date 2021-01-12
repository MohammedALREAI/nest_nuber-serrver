import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { PaymentsController } from "./payments.controller";
import { PaymentResolver } from "./payments.resolver";
import { PaymentService } from "./payments.service";
import { PaymentRepository } from "./Repostory/payment.repostory";

@Module({
  controllers: [PaymentsController],
  imports: [TypeOrmModule.forFeature([PaymentRepository, Restaurant])],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentsModule {}
