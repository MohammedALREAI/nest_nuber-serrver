import { CategoryRepository } from "./category.repository";
import { EntityRepository, Repository, Raw } from "typeorm";
import { Restaurant } from "../entities/restaurant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Dish } from "../entities/dish.entity";
import { User } from "../../users/entities/user.entity";
import { CreateRestaurantInput, CreateRestaurantOutput } from "../dtos/create-restaurant.dto";
import { EnumErrorRestaurant } from "../Enum/enumError";
import { EditRestaurantInput, EditRestaurantOutput } from "../dtos/edit-restaurant.dto";
import { Category } from "../entities/cetegory.entity";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "../dtos/delete-restaurant.dto";
import { AllCategoriesOutput } from "../dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "../dtos/category.dto";
import { RestaurantsInput, RestaurantsOutput } from "../dtos/restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "../dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "../dtos/search-restaurant.dto";
import { CreateDishInput, CreateDishOutput } from "../dtos/create-dish.dto";
import { EditDishInput, EditDishOutput } from "../dtos/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "../dtos/delete-dish.dto";
import { MyRestaurantsOutput } from "../dtos/my-restaurants.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "../dtos/my-restaurant";

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  constructor(
    private readonly categoriesRepo: CategoryRepository,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {
    super();
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categoriesRepo.getOrCreate(createRestaurantInput.categoryName);
      newRestaurant.category = category;
      await this.save(newRestaurant);
      return {
        ok: true,
        restaurantId: newRestaurant.id,
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.CONT_CREATE,
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.findOne(editRestaurantInput.restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: EnumErrorRestaurant.NOT_FOUND,
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: EnumErrorRestaurant.EDIT_CONT,
        };
      }
      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categoriesRepo.getOrCreate(editRestaurantInput.categoryName);
      }
      await this.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.EDIT_CONT,
      };
    }
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found",
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: EnumErrorRestaurant.NOT_AUTHORIZED,
        };
      }
      await this.delete(restaurantId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.NOT_AUTHORIZED,
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categoriesRepo.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: "Could not load categories",
      };
    }
  }
  countRestaurants(category: Category) {
    return this.count({ category });
  }
  async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categoriesRepo.findOne(slug);
      if (!category) {
        return {
          ok: false,
          error: EnumErrorRestaurant.NOT_FOUND,
        };
      }
      const restaurants = await this.find({
        where: {
          category,
        },
        order: {
          isPromoted: "DESC",
        },
        take: 25,
        skip: (page - 1) * 25,
      });
      const totalResults = await this.countRestaurants(category);
      return {
        ok: true,
        restaurants,
        category,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.NOT_LOAD,
      };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.findAndCount({
        skip: (page - 1) * 3,
        take: 3,
        order: {
          isPromoted: "DESC",
        },
      });
      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.NOT_LOAD,
      };
    }
  }

  async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.findOne(restaurantId, {
        relations: ["menu"],
      });
      if (!restaurant) {
        return {
          ok: false,
          error: EnumErrorRestaurant.NOT_FOUND,
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.NOT_FOUND,
      };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalResults] = await this.findAndCount({
        where: {
          name: Raw(name => `${name} ILIKE '%${query}%'`),
        },
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.SEARCH_LOAD,
      };
    }
  }

  async createDish(owner: User, createDishInput: CreateDishInput): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.findOne(createDishInput.restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found",
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: EnumErrorRestaurant.NOT_AUTHORIZED,
        };
      }
      await this.dishes.save(this.dishes.create({ ...createDishInput, restaurant }));
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Could not create dish",
      };
    }
  }

  async editDish(owner: User, editDishInput: EditDishInput): Promise<EditDishOutput> {
    try {
      const dish = await this.dishes.findOne(editDishInput.dishId, {
        relations: ["restaurant"],
      });
      if (!dish) {
        return {
          ok: false,
          error: "Dish not found",
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.dishes.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "Could not delete dish",
      };
    }
  }

  async deleteDish(owner: User, { dishId }: DeleteDishInput): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOne(dishId, {
        relations: ["restaurant"],
      });
      if (!dish) {
        return {
          ok: false,
          error: EnumErrorRestaurant.NOT_FOUND,
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: EnumErrorRestaurant.NOT_AUTHORIZED,
        };
      }
      await this.dishes.delete(dishId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "Could not delete dish",
      };
    }
  }

  async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.find({ owner });
      return {
        restaurants,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.NOT_FOUND,
      };
    }
  }
  async myRestaurant(owner: User, { id }: MyRestaurantInput): Promise<MyRestaurantOutput> {
    try {
      const restaurant = await this.findOne({ owner, id }, { relations: ["menu", "orders"] });
      return {
        restaurant,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: EnumErrorRestaurant.NOT_FOUND,
      };
    }
  }
}
