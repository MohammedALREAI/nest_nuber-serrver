import { EditDishOutputDto, EditDishInputDto } from "../dtos/editDish";
import { DeleteDishInputDto, DeleteDishOutputDto } from "../dtos/deleteDishDto";
import { User } from "../../user/entitty/user.entity";
import { CreateDishInputDto, CreateDishOutputDto } from "../dtos/createDishDto";
export interface IDishServices {
  createDish(owner: User, args: CreateDishInputDto): Promise<CreateDishOutputDto>;

  editDish(owner: User, args: EditDishInputDto): Promise<EditDishOutputDto>;

  deleteDish(owner: User, args: DeleteDishInputDto): Promise<DeleteDishOutputDto>;
}
