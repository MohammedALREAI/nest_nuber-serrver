import { ObjectType, Field, InputType } from "@nestjs/graphql";
import { Column, Entity, Unique, ManyToOne, RelationId } from "typeorm";
import { Shared } from "../../../common/entity/shared";
import { IsString, IsDefined } from "class-validator";
import { Restaurants } from "../../restaurants/entity/restaurants.entity";
import { User } from "../../user/entitty/user.entity";
@InputType("PaymentInputType", { isAbstract: true })
@ObjectType()
@Entity("payments")
export class Payment extends Shared {
  @Field(() => String)
  @Column("string")
  @IsString()
  @IsDefined()
  transactionId: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.payments,
  )
  user: User;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  @Field(() => Restaurants)
  @ManyToOne(_ => Restaurants)
  restaurant: Restaurants;

  @Field(type => String)
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: string;
}
