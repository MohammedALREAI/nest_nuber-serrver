import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { Role } from "../../common/decorator/role.decorator";
import { DishService } from "./dish.service";
import { Dish } from "./entity/dish.entity";
import { CreateDishInputDto, CreateDishOutputDto } from "./dtos/createDishDto";
import { User } from "../user/entitty/user.entity";
import { AuthUser } from "../../common/decorator/auth.decorator";
import { EditDishOutputDto, EditDishInputDto } from "./dtos/editDish";
import { DeleteDishInputDto, DeleteDishOutputDto } from "./dtos/deleteDishDto";

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}

  /***
   * ccreate dish
   * @Prams CreateDishInputDto
   * @retaurn CreateDishOutputDto
   */
  @Mutation(() => CreateDishOutputDto)
  @Role(["Owner"])
  async createDish(
    @AuthUser() owner: User,
    @Args() args: CreateDishInputDto,
  ): Promise<CreateDishOutputDto> {
    return this.dishService.createDish(owner, args);
  }
  /*
  Edit
  * EDIT dish
  * @Prams EditDishInputDto
  * @retaurn EditDishOutputDto
  */

  /***
   * ccreate dish
   * @Prams CreateDishInputDto
   * @retaurn CreateDishOutputDto
   */
  @Mutation(() => CreateDishOutputDto)
  @Role(["Owner"])
  async CreateDish(
    @AuthUser() owner: User,
    @Args() args: CreateDishInputDto,
  ): Promise<CreateDishOutputDto> {
    return this.dishService.createDish(owner, args);
  }

  @Mutation(() => EditDishOutputDto)
  @Role(["Owner"])
  async editDish(@AuthUser() owner: User, args: EditDishInputDto): Promise<EditDishOutputDto> {
    return await this.dishService.editDish(owner, args);
  }

  @Mutation(() => DeleteDishOutputDto)
  @Role(["Owner"])
  async deleteDish(
    @AuthUser() owner: User,
    args: DeleteDishInputDto,
  ): Promise<DeleteDishOutputDto> {
    return this.dishService.deleteDish(owner, args);
  }
}
