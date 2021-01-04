import { Entity, Column, ManyToOne, ManyToMany, JoinTable, RelationId } from "typeorm";
import { Shared } from "../../../common/entity/shared";
import { ObjectType, InputType, registerEnumType, Field, Float } from "@nestjs/graphql";
import { User } from "../../user/entitty/user.entity";
import { OrderStatus } from "../enum/EnumOrderStaus";
import { Restaurants } from "../../restaurants/entity/restaurants.entity";
import { OrderItem } from "./OrderItem.entity";

registerEnumType(OrderStatus, { name: "OrderStatus" });

@InputType("OrderInputType", { isAbstract: true })
@ObjectType("OrderObjectType")
@Entity("Orders")
export class Order extends Shared {
  @Field(() => User, { nullable: true })
  @ManyToOne(
    () => User,
    user => user.orders,
    { onDelete: "SET NULL", nullable: true, eager: true },
  )
  customer: User;
  @Column()
  @RelationId((order: Order) => order.customer)
  customerId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(
    () => User,
    user => user.driver,
    { onDelete: "SET NULL", nullable: true, eager: true },
  )
  driver?: User;

  @Column()
  @RelationId((order: Order) => order.driver)
  driverId: string;

  @Field(() => Restaurants, { nullable: true })
  @ManyToOne(
    () => Restaurants,
    res => res.orders,
    { onDelete: "SET NULL", nullable: true, eager: true },
  )
  restaurant?: Restaurants;

  @Column()
  @RelationId((order: Order) => order.restaurant)
  restaurantId: string;

  @Field(() => [OrderItem])
  @ManyToMany(() => OrderItem, { eager: true })
  @JoinTable()
  items: OrderItem[];

  @Column()
  @RelationId((order: Order) => order.items)
  itemIds: string[];
  @Column("float", { nullable: true })
  @Field(() => Float, { nullable: true })
  total?: number;

  @Column({ type: "enum", enum: OrderStatus, array: false })
  @Field(() => OrderStatus)
  status: OrderStatus;
}
