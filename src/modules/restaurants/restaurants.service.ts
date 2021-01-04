import { Injectable } from "@nestjs/common";
import { RestaurantRepository } from "./Repository/restaurants.repository";
import { IRestaurant } from "./interface/IRestaurant";
import { CreateRestaurantOutputType, CreateRestaurantInputType } from "./dtos/createRestaurantDto";
import { Category } from "../category/entity/Catogory.entity";
import { Repository } from "typeorm";
import { EditRestaurantInputType, EditRestaurantOutputMutation } from "./dtos/editRestaurants";
import { DeleteRestaurantInputType, DeleteRestaurantOutputType } from "./dtos/deleteRestaurantdto";
import { User } from "../user/entitty/user.entity";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurantDto";
import { SingleRestaurantOutput, SingleRestaurantInput } from "./dtos/resturentItem.Dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/SearchRestaurant";
@Injectable()
export class RestaurantsService implements IRestaurant {
  //HINT WE Can  not used the @iNJECTrEPOSTORY BY COVERT THE
  constructor(
    private restaurantRepository: RestaurantRepository,
    private readonly categoryRep: Repository<Category>,
  ) {}
  async restaurants(args: RestaurantInput): Promise<RestaurantOutput> {
    return this.restaurantRepository.restaurants(args);
  }
  async createRestaurant(args: CreateRestaurantInputType): Promise<CreateRestaurantOutputType> {
    return this.restaurantRepository.createRestaurant(args);
  }
  async findOneById({ id }: SingleRestaurantInput): Promise<SingleRestaurantOutput> {
    return this.restaurantRepository.findOneById(id);
  }
  async deleteRestaurant(
    owner: User,
    args: DeleteRestaurantInputType,
  ): Promise<DeleteRestaurantOutputType> {
    return this.restaurantRepository.deleteRestaurant(owner, args);
  }
  async editRestaurant(
    owner: User,
    data: EditRestaurantInputType,
  ): Promise<EditRestaurantOutputMutation> {
    return this.restaurantRepository.editRestaurant(owner, data);
  }

  async searchRestaurant({ query }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    return this.restaurantRepository.searchRestaurant(query);
  }

  async restaurantCount(category: Category): Promise<number> {
    return this.restaurantRepository.restaurantCount(category);
  }
}
