import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "./order.service";
import { OrderResolver } from "./order.resolver";
import { OrderRepository } from "./repository/order.repository";
import { RestaurantRepository } from "../restaurants/Repository/restaurants.repository";
import { UserRepository } from "../user/user.repostory";
import { DishRepository } from "../dish/Repository/dish.Repostory";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      RestaurantRepository,
      UserRepository,
      DishRepository,
    ]),
  ],
  providers: [OrderService, OrderResolver],
  exports: [],
})
export class OrderModule {}
