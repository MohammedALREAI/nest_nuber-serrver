import { Injectable } from "@nestjs/common";
import { RestaurantRepository } from "./restaurants.repository";
import { IRestaurant } from "./interface/IRestaurant";
import { InjectRepository } from "@nestjs/typeorm";
import { createRestaurantDto } from "./dtos/createRestaurantDto";
import { Restaurants } from "./entity/restaurants.entity";
@Injectable()
export class RestaurantsService implements IRestaurant {
  constructor(
    @InjectRepository(RestaurantRepository) private restaurantRepository: RestaurantRepository,
  ) {}
  async restaurants(): Promise<Restaurants[]> {
    return this.restaurantRepository.restaurants();
  }
  async createRestaurant(args: createRestaurantDto): Promise<Restaurants> {
    return this.restaurantRepository.createRestaurant(args);
  }
  async findById(id: string): Promise<Restaurants> {
    return this.restaurantRepository.findById(id);
  }
}
