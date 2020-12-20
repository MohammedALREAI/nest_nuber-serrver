import { Restaurants } from "./entity/restaurants.entity";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { RestaurantsService } from "./restaurants.service";
import { createRestaurantDto } from "./dtos/createRestaurantDto";

@Resolver(() => Restaurants)
export class RestaurantResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  @Query(types => [Restaurants])
  async restaurants(): Promise<Restaurants[]> {
    return this.restaurantsService.restaurants();
  }
  @Query(types => Restaurants)
  async restaurant(@Args("id") id: string): Promise<Restaurants> {
    return this.restaurantsService.findById(id);
  }

  @Mutation(type => Restaurants)
  async createRestaurant(@Args("args") args: createRestaurantDto): Promise<Restaurants> {
    return this.restaurantsService.createRestaurant(args);
  }
}
