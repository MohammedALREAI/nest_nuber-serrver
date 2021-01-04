import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entity/Catogory.entity";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { AllCategoriesOutputQuery } from "../dtos/AllcategoriesDto";
import { CategoryInput, CategoryOutput } from "../dtos/categoryFilterDto";
import { RestaurantRepository } from "../../restaurants/Repository/restaurants.repository";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly restaurantRepo: RestaurantRepository) {
    super();
  }

  async findOneById(id: string): Promise<Category> {
    try {
      const res = await this.findOne({ where: { id } });

      if (!res) {
        throw new NotFoundException(" there is no item like that ");
      }
      return res;
    } catch (e) {
      throw new InternalServerErrorException("there is some issuie");
    }
  }
  async findOneBySlug(slug: string): Promise<Category> {
    try {
      const res = await this.findOne({ where: { slug } });

      if (!res) {
        throw new NotFoundException(" there is no item like that ");
      }
      return res;
    } catch (e) {
      throw new InternalServerErrorException(`there is some issuie ${e}`);
    }
  }

  /*

getAllcategories
  */

  async AllCategories(): Promise<AllCategoriesOutputQuery> {
    try {
      const categories = await this.find({});
      if (!categories) {
        return {
          ok: false,
          error: "there  are not found the items",
          categories: null,
        };
      }
      //ther is item found
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      throw new InternalServerErrorException(`ther are some issies ${error}`);
    }
  }

  /**
   *CategoryFilterBySlug
   *@params =>CategoryFilterBySlugInputQuery
   *@returns =>CategoryFilterBySlugOutputQuery
   * steps
   */

  async CategoryFilterBySlug(args: CategoryInput): Promise<CategoryOutput> {
    const { slug, page } = args;
    const category = this.findOne({ slug });
    if (!category) {
      return {
        ok: false,
        error: "there are some missing for data ",
      };
    }

    const condition = {
      categories: category,
      take: 25,
      skip: (page - 1) * 25,
    };

    const res = await this.restaurantRepo.find({ ...condition });
    (await category).restaurants = res;
    const totalResturent = await this.restaurantRepo.restaurantCount(category);
    return {
      ok: true,
      category,
      totalPage: Math.ceil(totalResturent),
    };
  }
}
