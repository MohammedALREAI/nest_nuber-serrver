import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dish } from "./entities/dish.entity";
import { CategoryRepository } from "./repositories/category.repository";
import { CategoryResolver, DishResolver, RestaurantResolver } from "./restaurants.resolver";
import { RestaurantService } from "./restaurants.service";
import { RestaurantRepository } from "./repositories/restaurant.repostory";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantRepository, Dish, CategoryRepository])],
  providers: [RestaurantResolver, CategoryResolver, DishResolver, RestaurantService],
})
export class RestaurantsModule {}
