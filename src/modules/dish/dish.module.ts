import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DishService } from "./dish.service";
import { DishResolver } from "./dish.resolver";
import { DishRepository } from "./Repository/dish.Repostory";

@Module({
  imports: [TypeOrmModule.forFeature([DishRepository])],
  providers: [DishService, DishResolver],
})
export class DishModule {}
