import { RestaurantsService } from "./restaurants.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurants } from "./entity/restaurants.entity";
import { RestaurantResolver } from "./restaurants.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Restaurants])],
  controllers: [],
  providers: [RestaurantsService, RestaurantResolver],
})
export class RestaurantsModule {}
