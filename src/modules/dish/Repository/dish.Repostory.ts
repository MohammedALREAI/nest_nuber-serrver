import { EntityRepository, Repository } from "typeorm";
import { Dish } from "../entity/dish.entity";
import { CreateDishInputDto, CreateDishOutputDto } from "../dtos/createDishDto";
import { User } from "../../user/entitty/user.entity";
import { RestaurantRepository } from "../../restaurants/Repository/restaurants.repository";
import { EditDishOutputDto, EditDishInputDto } from "../dtos/editDish";
import { InternalServerErrorException } from "@nestjs/common";
import { DeleteDishInputDto, DeleteDishOutputDto } from "../dtos/deleteDishDto";
import { IDishServices } from "../interface/IDishServicess";

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> implements IDishServices {
  constructor(private readonly resRepo: RestaurantRepository) {
    super();
  }

  async createDish(owner: User, args: CreateDishInputDto): Promise<CreateDishOutputDto> {
    const { restaurantId } = args;

    const { restaurant } = await this.resRepo.findOneById(restaurantId);

    // there is no resturent  ad the user not have Autghourization to access to this  section
    if (!restaurant && owner.id !== restaurant.id) {
      return {
        ok: false,
        error:
          "there is no Authorization to access to this section so please login as admin or something also",
      };
    }

    //this section the  restturent is found and the  hovae Authorization to accesss to this section so

    // so we create the dish
    await this.save(this.create({ ...args, restaurant }));
    return {
      ok: true,
    };
  }

  async findOneDish(id: string): Promise<{ ok: boolean; dish?: Dish; error?: string }> {
    try {
      const dish = await this.findOne(id, { relations: ["restaurant"] });
      if (!dish) {
        return {
          ok: false,
          dish: null,
          error: `there is no dish found `,
        };
      }
      return {
        ok: true,
        dish,
      };
    } catch (e) {
      throw new InternalServerErrorException(`there are some issiue in the delate`);
    }
  }

  async editDish(owner: User, args: EditDishInputDto): Promise<EditDishOutputDto> {
    const { id } = args;

    const { ok, dish, error } = await this.findOneDish(id);
    if (!dish || ok === false || error) {
      return {
        ok,
        error,
      };
    }

    // there is no resturent  ad the user not have Autghourization to access to this  section
    if (owner.id !== dish.restaurant.id) {
      return {
        ok,
        error:
          "there is no Authorization to access to this section so please login as admin or something also",
      };
    }

    //this section the  restturent is found and the  hovae Authorization to accesss to this section so

    // so we create the dish
    await this.save([
      {
        id,
        ...args,
      },
    ]);

    return {
      ok: true,
    };
  }

  async deleteDish(owner: User, args: DeleteDishInputDto): Promise<DeleteDishOutputDto> {
    const { id } = args;
    const { error, ok, dish } = await this.findOneDish(id);
    //cheack if dish found
    if (error || ok === false || !dish) {
      return {
        ok,
        error,
      };
    }
    if (owner.id !== dish.restaurant.id) {
      return {
        ok,
        error:
          "there is no Authorization to access to this section so please login as admin or something also",
      };
    }

    const res = await this.delete(id);
    if (res.affected < 1) {
      return {
        ok: false,
        error: "there is no item affected this operations",
      };
    }
    return {
      ok: true,
    };
  }
}
