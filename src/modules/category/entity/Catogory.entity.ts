import { ObjectType, Field, InputType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, Unique } from "typeorm";
import { Shared } from "../../../common/entity/shared";
import { IsString, IsDefined } from "class-validator";
import { Restaurants } from "../../restaurants/entity/restaurants.entity";
@InputType("CategoryInputType", { isAbstract: true })
@ObjectType()
@Entity("categories")
@Unique(["name"])
export class Category extends Shared {
  @Field(() => String)
  @Column("string")
  @IsString()
  @IsDefined()
  name: string;
  @Field(() => String, { nullable: true })
  @Column("string", { nullable: true })
  @IsString()
  @IsDefined()
  coverImage: string;
  @Field(() => [Restaurants], { nullable: true })
  @OneToMany(
    () => Restaurants,
    restaurants => restaurants.category,
  )
  restaurants: Restaurants[];

  @Field(() => String)
  @Column("string", { unique: true })
  @IsString()
  @IsDefined()
  slug: string;
}
