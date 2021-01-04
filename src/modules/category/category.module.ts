import { CategoryService } from "./category.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryRepository } from "./Repostory/category.repostory";
import { CategoryResolver } from "./Category.resolver";
import { RestaurantsService } from "../restaurants/restaurants.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository])],
  providers: [CategoryService, CategoryResolver, RestaurantsService],
})
export class CategoryModule {}
