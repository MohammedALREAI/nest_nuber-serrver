import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "./dtos/my-restaurant";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { Category } from "./entities/cetegory.entity";

import { RestaurantRepository } from "./repositories/restaurant.repostory";

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepo: RestaurantRepository) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantRepo.createRestaurant(owner, createRestaurantInput);
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantRepo.editRestaurant(owner, editRestaurantInput);
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantRepo.deleteRestaurant(owner, { restaurantId });
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantRepo.allCategories();
  }
  countRestaurants(category: Category) {
    return this.restaurantRepo.count({ category });
  }
  async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
    return await this.restaurantRepo.findCategoryBySlug({ slug, page });
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    return await this.restaurantRepo.allRestaurants({ page });
  }

  async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
    return await this.restaurantRepo.findRestaurantById({ restaurantId });
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    return await this.restaurantRepo.searchRestaurantByName({ query, page });
  }

  async createDish(owner: User, createDishInput: CreateDishInput): Promise<CreateDishOutput> {
    return await this.restaurantRepo.createDish(owner, createDishInput);
  }

  async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
    return await this.restaurantRepo.editDish(owner, editDishInput);
  }

  async deleteDish(owner: User, { dishId }: DeleteDishInput): Promise<DeleteDishOutput> {
    return await this.restaurantRepo.deleteDish(owner, { dishId });
  }

  async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
    return await this.restaurantRepo.myRestaurants(owner);
  }
  async myRestaurant(owner: User, { id }: MyRestaurantInput): Promise<MyRestaurantOutput> {
    return await this.restaurantRepo.myRestaurant(owner, { id });
  }
}
