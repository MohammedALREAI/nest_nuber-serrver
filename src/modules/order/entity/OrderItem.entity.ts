import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Shared } from "../../../common/entity/shared";
import { Dish } from "../../dish/entity/dish.entity";

@InputType("OrderItemOptionInputType", { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  choice: string;
}
@InputType("OrderItemInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends Shared {
  @Field(() => Dish)
  @ManyToOne(() => Dish, { nullable: true, onDelete: "CASCADE" })
  dish: Dish;

  @Column()
  @RelationId((orderItem: OrderItem) => orderItem.dish)
  dishId: string;

  @Field(() => [OrderItemOption], { nullable: true })
  @Column({ type: "json", nullable: true })
  options?: OrderItemOption[];
}
