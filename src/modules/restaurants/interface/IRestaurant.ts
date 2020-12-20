import { Restaurants } from "../entity/restaurants.entity";
import { createRestaurantDto } from "../dtos/createRestaurantDto";
export interface IRestaurant {
  restaurants(): Promise<Restaurants[]>;
  createRestaurant(args: createRestaurantDto): Promise<Restaurants>;
  findById(id: string): Promise<Restaurants>;
}
