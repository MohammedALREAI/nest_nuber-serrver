import { ObjectType, Field, InputType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, RelationId, OneToMany } from "typeorm";
import { Shared } from "../../../common/entity/shared";
import { Category } from "../../category/entity/Catogory.entity";
import { User } from "../../user/entitty/user.entity";
import { Dish } from "../../dish/entity/dish.entity";

import { Order } from "../../order/entity/order.entity";

@InputType("RestaurantsInputType", { isAbstract: true })
@ObjectType()
@Entity("restaurants")
export class Restaurants extends Shared {
  @Field(() => String)
  @Column("string")
  name: string;
  @Field(() => String)
  @Column("string")
  coverImage: string;
  @Field(() => String)
  @Column("string")
  address: string;
  @Field(() => Boolean, { defaultValue: true })
  @Column("bool")
  isVegan: boolean;
  @Field(() => String)
  ownNumber: string;
  //relalations Category

  @Field(() => Category, { nullable: true })
  @ManyToOne(
    () => Category,
    category => category.restaurants,
    { onDelete: "SET NULL" },
  )
  category: Category;

  //relalations Category

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.restaurants,
    { onDelete: "CASCADE" },
  )
  owner: User;

  @RelationId((res: Restaurants) => res.owner)
  @Column("string")
  ownerId: string;

  @Field(() => [Dish])
  @OneToMany(
    () => Dish,
    (dish: Dish) => dish.restaurant,
  )
  menu: Dish[];
  // @Field(() => [Payment])
  // @OneToMany(
  //   () => Payment,
  //   (payment: Payment) => payment.restaurant,
  // )
  // payments: Payment[];

  //relation ORDER

  @Field(() => [Order])
  @OneToMany(
    () => Order,
    (order: Order) => order.restaurant,
  )
  orders: Order[];

  @Field(() => Boolean)
  @Column({ default: false })
  isPromoted: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntil: Date;
}
