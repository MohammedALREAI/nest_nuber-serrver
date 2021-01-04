import { Resolver, Query, ResolveField, Parent, Int } from "@nestjs/graphql";
import { Category } from "./entity/Catogory.entity";
import { RestaurantRepository } from "../restaurants/Repository/restaurants.repository";
import { AllCategoriesOutputQuery } from "./dtos/AllcategoriesDto";
import { CategoryService } from "./category.service";
import { CategoryInput, CategoryOutput } from "./dtos/categoryFilterDto";

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    // private readonly restaurantRepository: RestaurantRepository,
    // private readonly categoryRepository: CategoryRepository,
    private readonly categoryService: CategoryService,
    private readonly restaurantService: RestaurantRepository,
  ) {}

  @Query(() => AllCategoriesOutputQuery)
  async AllCategories(): Promise<AllCategoriesOutputQuery> {
    return this.categoryService.AllCategories();
  }

  @ResolveField(() => Int)
  async restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.restaurantCount(category);
  }

  @Query(() => CategoryOutput)
  async Category(args: CategoryInput): Promise<CategoryOutput> {
    return this.categoryService.CategoryFilterBySlug(args);
  }
}
