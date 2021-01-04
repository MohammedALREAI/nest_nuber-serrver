import { Injectable } from "@nestjs/common";
import { DishRepository } from "./Repository/dish.Repostory";
import { CreateDishInputDto, CreateDishOutputDto } from "./dtos/createDishDto";
import { User } from "../user/entitty/user.entity";
import { EditDishInputDto, EditDishOutputDto } from "./dtos/editDish";
import { DeleteDishInputDto, DeleteDishOutputDto } from "./dtos/deleteDishDto";
import { IDishServices } from "./interface/IDishServicess";

@Injectable()
export class DishService implements IDishServices {
  constructor(private readonly dishRepo: DishRepository) {}

  async createDish(owner: User, args: CreateDishInputDto): Promise<CreateDishOutputDto> {
    return this.dishRepo.createDish(owner, args);
  }

  async editDish(owner: User, args: EditDishInputDto): Promise<EditDishOutputDto> {
    return this.dishRepo.editDish(owner, args);
  }

  async deleteDish(owner: User, args: DeleteDishInputDto): Promise<DeleteDishOutputDto> {
    return this.dishRepo.deleteDish(owner, args);
  }
}
