import { Restaurants } from "../entity/restaurants.entity";
import { CreateRestaurantInputType, CreateRestaurantOutputType } from "../dtos/createRestaurantDto";
import { EditRestaurantInputType, EditRestaurantOutputMutation } from "../dtos/editRestaurants";
import { DeleteRestaurantInputType, DeleteRestaurantOutputType } from "../dtos/deleteRestaurantdto";
import { User } from "../../user/entitty/user.entity";
import { RestaurantInput, RestaurantOutput } from "../dtos/restaurantDto";
export interface IRestaurant {
  restaurants(args: RestaurantInput): Promise<RestaurantOutput>;
  createRestaurant(args: CreateRestaurantInputType): Promise<CreateRestaurantOutputType>;
  findOneById(id: string): Promise<Restaurants>;
  updateRestaurant(
    owner: User,
    args: EditRestaurantInputType,
  ): Promise<EditRestaurantOutputMutation>;
  deleteRestaurant(
    owner: User,
    args: DeleteRestaurantInputType,
  ): Promise<DeleteRestaurantOutputType>;
}
