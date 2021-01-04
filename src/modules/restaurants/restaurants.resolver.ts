import { Restaurants } from "./entity/restaurants.entity";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { RestaurantsService } from "./restaurants.service";
import { CreateRestaurantOutputType, CreateRestaurantInputType } from "./dtos/createRestaurantDto";
import { Role } from "../../common/decorator/role.decorator";
import { OwnerGuard } from "../../common/Guards/owner.guard";
import { UseGuards } from "@nestjs/common";
import { EditRestaurantInputType, EditRestaurantOutputMutation } from "./dtos/editRestaurants";
import { AuthGuard } from "../../common/Guards/auth.guard";
import { User } from "../user/entitty/user.entity";
import { DeleteRestaurantInputType, DeleteRestaurantOutputType } from "./dtos/deleteRestaurantdto";
import { RestaurantOutput, RestaurantInput } from "./dtos/restaurantDto";
import { SingleRestaurantOutput, SingleRestaurantInput } from "./dtos/resturentItem.Dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/SearchRestaurant";

@Resolver(() => Restaurants)
export class RestaurantResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Query(() => SearchRestaurantOutput)
  async searchRestaurant(@Args() { query }: SearchRestaurantInput) {
    return this.restaurantsService.searchRestaurant(query);
  }

  @Query(() => RestaurantOutput)
  async restaurants(@Args("args") args: RestaurantInput): Promise<RestaurantOutput> {
    return this.restaurantsService.restaurants(args);
  }
  /*
  ** restaurants return with the some filter
  @params data
  **


  */

  SingleRestaurantInput;
  @Query(() => SingleRestaurantOutput)
  async restaurant(@Args() { id }: SingleRestaurantInput): Promise<SingleRestaurantOutput> {
    return this.restaurantsService.findOneById(id);
  }

  @Mutation(() => CreateRestaurantOutputType)
  async createRestaurant(
    @Args("args") args: CreateRestaurantInputType,
  ): Promise<CreateRestaurantOutputType> {
    return this.restaurantsService.createRestaurant(args);
  }
  @Mutation(() => Boolean)
  @UseGuards(OwnerGuard)
  @Role(["Owner"])
  async editRestaurant(
    @AuthGuard() owner: User,
    @Args("args") args: EditRestaurantInputType,
  ): Promise<EditRestaurantOutputMutation> {
    return this.restaurantsService.updateRestaurant(owner, args);
  }

  @Mutation(() => Boolean)
  @Role(["Owner"])
  async deleteRestaurant(
    @AuthGuard() owner: User,
    @Args("id") args: DeleteRestaurantInputType,
  ): Promise<DeleteRestaurantOutputType> {
    return this.restaurantsService.deleteRestaurant(owner, args);
  }
}
