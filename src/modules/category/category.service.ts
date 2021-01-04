import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./Repostory/category.repostory";
import { ICategoryServices } from "./interface/ICategoryServices";
import { AllCategoriesOutputQuery } from "./dtos/AllcategoriesDto";

@Injectable()
export class CategoryService implements ICategoryServices {
  constructor(private readonly categoryRep: CategoryRepository) {}
  async AllCategories(): Promise<AllCategoriesOutputQuery> {
    return this.categoryRep.AllCategories();
  }
}
