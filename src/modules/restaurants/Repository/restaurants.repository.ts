import { Restaurants } from "../entity/restaurants.entity";
import { EntityRepository, Repository, Row } from "typeorm";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateRestaurantInputType, CreateRestaurantOutputType } from "../dtos/createRestaurantDto";
import { CategoryRepository } from "../../category/Repostory/category.repostory";
import { User } from "../../user/entitty/user.entity";
import { EditRestaurantOutputMutation, EditRestaurantInputType } from "../dtos/editRestaurants";
import { Category } from "../../category/entity/Catogory.entity";
import { DeleteRestaurantInputType, DeleteRestaurantOutputType } from "../dtos/deleteRestaurantdto";
import { RestaurantInput, RestaurantOutput } from "../dtos/restaurantDto";
import { SingleRestaurantOutput } from "../dtos/resturentItem.Dto";
import { SearchRestaurantOutput, SearchRestaurantInput } from "../dtos/SearchRestaurant";
import { MutationOutput } from "../../../common/dto/MutationOutput";

@EntityRepository(Restaurants)
export class RestaurantRepository extends Repository<Restaurants> {
  constructor(private readonly categoryRepo: CategoryRepository) {
    super();
  }

  async restaurantCount(category: Category): Promise<number> {
    return this.count(category);
  }

  /*
   *getOrCreate
   * @para  ms => owner
   * @prams data => EditRestaurantInputType
   *  return  =>EditRestaurantOutputMutation
   * steps
   * find onme the items
   *
   * **/

  async getOrCreate(name: string): Promise<Category> {
    const categorySlug = name
      .trim()
      .toLowerCase()
      .replace(/ /g, "-");
    try {
      let category = await this.categoryRepo.findOneBySlug(categorySlug);
      if (!category) {
        category = await this.categoryRepo.save(
          this.categoryRepo.create({
            slug: categorySlug,
            name: name.trim().toLowerCase(),
          }),
        );
      }
      return category;
    } catch (e) {
      throw new InternalServerErrorException(` there are some issuie in the ${e}`);
    }
  }

  /*
   *editRestaurant
   * @params => owner
   * @prams data => EditRestaurantInputType
   *  return  =>EditRestaurantOutputMutation
   * steps
   * find onme the items
   *

  **/

  async findOneRestaurant(id: string, condition?: any): Promise<SingleRestaurantOutput> {
    try {
      const restaurant = await this.findOne(id, condition);
      if (!restaurant) {
        return {
          ok: false,
          error: "there is no found restaurant like that",
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (e) {
      return {
        ok: false,
        error: "there is no found restaurant like that",
      };
    }
  }

  async editRestaurant(
    owner: User,
    data: EditRestaurantInputType,
  ): Promise<EditRestaurantOutputMutation> {
    const isFound = await this.findOne(data.id, {
      loadRelationIds: true,
    });

    if (!isFound) {
      throw new NotFoundException(`id is not found `);
    }

    //check if it Autherization to acces to this items
    if (owner.id !== isFound.ownerId) {
      return {
        ok: false,
        error: "there are no Authorizations  to Access to this ",
      };
    }
    let category: Category = null;

    if (data.categoryName) {
      category = await this.getOrCreate(data.categoryName);
    }
    const res = await this.save([
      {
        id: data.restaurantId,
        ...data,
        ...(category && { category }),
      },
    ]);
    if (res.affected > 0) {
      return {
        ok: true,
        error: null,
      };
    }

    return {
      ok: false,
      error: " there is no it affected in this operation",
    };
  }
  catch(e) {
    throw new InternalServerErrorException(` there are some issuie in the ${e}`);
  }

  /***
   *
   * restaurants it git some resturen with the paganmation item s
   * @params restaurantInput
   * result restaurantOutput
   * ******/

  async restaurants(args: RestaurantInput): Promise<RestaurantOutput> {
    const { page } = args;
    try {
      const condition = {
        skip: 25,
        taken: (page - 1) * 25,
      };
      const [restaurants, totalItems] = await this.findAndCount({ ...condition });
      if (!restaurants) {
        return {
          ok: false,

          error: "there is no item like that ",
        };
      }
      return {
        ok: true,
        restaurants,
        totalPage: Math.ceil(totalItems / 25),
        totalItems,
      };
    } catch (e) {
      throw new InternalServerErrorException("there is some issuie");
    }
  }

  /*****
   *searchRestaurant
   * r@parms query
   * return  serachResturentOutput
   * **
   *
   * */

  async searchRestaurant({ query, page }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalItems] = await this.findAndCount({
        where: {
          name: Row(name => ` ${name} ILIKE '%${query}%'`),
        },
        skip: 25,
        take: (page - 1) * 25,
      });

      if (!restaurants) {
        return {
          ok: false,
          error: "cont found any item like that",
        };
      }

      return {
        ok: true,
        restaurants,
        totalItems,
        totalPage: Math.ceil(totalItems / 25),
      };
    } catch (error) {}
  }

  /***
   *findbyids
   *@parms id->string
   *return  >PROMISE Resturents
   * **/

  async findOneById(id: string): Promise<SingleRestaurantOutput> {
    try {
      const restaurant = await this.findOne(id, {
        relations: ["menu"],
      });

      if (!restaurant) {
        return {
          ok: false,
          error: "there is  not found items",
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (e) {
      throw new InternalServerErrorException("there is some issuie");
    }
  }

  async createRestaurant(args: CreateRestaurantInputType): Promise<CreateRestaurantOutputType> {
    const { name } = args;
    const newRes = this.create(args);
    const category = await this.getOrCreate(name);
    newRes.categories = category;
    await this.save(newRes);
    return {
      ok: true,
    };
  }

  /*
     *deleteRestaurant
     * @params => args => DeleteRestaurantInputType
     *
     *  return  =>DeleteRestaurantOutputType
     * steps
     * find onme the items if it  found
     *

    **/

  async deleteRestaurant(
    owner: User,
    args: DeleteRestaurantInputType,
  ): Promise<DeleteRestaurantOutputType> {
    const { id } = args;
    try {
      const res = await this.findOneById(id);
      if (!res) {
        return {
          ok: false,
          error: " not found item  delete process ",
        };
      }

      // cheack if user own the  this resturent
      if (owner.id !== res.ownerId) {
        return {
          ok: false,
          error: "there are no Authorizations  to Access to this ",
        };
      }
      const isDelated = await this.delete(id);
      // there are some item affected
      if (isDelated.affected > 0) {
        //there is row affected
        return {
          ok: true,
        };
      }

      return {
        ok: false,
        error: " there  is no element affected in the delete process ",
      };
    } catch (e) {
      throw new InternalServerErrorException(`there is some issuie ${e}`);
    }
  }
}
