import { AllCategoriesOutputQuery } from "../dtos/AllcategoriesDto";

export interface ICategoryServices {
  AllCategories(): Promise<AllCategoriesOutputQuery>;
}
