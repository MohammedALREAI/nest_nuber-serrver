import { Shared } from "../../../common/entity/shared";
import { InputType, ObjectType, Field, Int } from "@nestjs/graphql";
import { Entity, Column, ManyToOne, RelationId } from "typeorm";
import { IsDefined, IsNumber, IsString, IsUrl, Length } from "class-validator";
import { Restaurants } from "../../restaurants/entity/restaurants.entity";

@InputType("DishOptionInputType", { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field(() => String)
  name: string;
  @Field(() => [String], { nullable: true })
  choices: string[];
  @Field(() => Int, { nullable: true })
  extra?: number;
}

@InputType("DishInputType", { isAbstract: true })
@ObjectType()
@Entity("dishes")
export class Dish extends Shared {
  @Column("string")
  @Field(() => String)
  @IsDefined()
  @IsString()
  @Length(5, 30)
  name: string;

  @Column("int")
  @Field(() => Int)
  @IsDefined()
  @IsNumber()
  price: number;

  @Column("string")
  @Field(() => String, { nullable: true })
  @IsDefined()
  @IsUrl()
  photo: string;

  @Column("string")
  @Field(() => String)
  @IsDefined()
  @IsString()
  @Length(5, 200)
  description: string;

  @Field(() => [Dish], { nullable: true })
  @Column("json", { nullable: true })
  options: DishOption[];

  //realation

  @Field(() => Restaurants, { nullable: true })
  @ManyToOne(
    () => Restaurants,
    res => res.menu,
    { onDelete: "CASCADE" },
  )
  restaurant: Restaurants;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: string;
}
