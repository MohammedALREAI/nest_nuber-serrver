import { RestaurantsService } from "./restaurants.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantResolver } from "./restaurants.resolver";
import { RestaurantRepository } from "./Repository/restaurants.repository";
import { CategoryRepository } from "../category/Repostory/category.repostory";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantRepository, CategoryRepository])],
  controllers: [],
  providers: [RestaurantsService, RestaurantResolver],
  exports: [RestaurantsService, RestaurantRepository],
})
export class RestaurantsModule {}
