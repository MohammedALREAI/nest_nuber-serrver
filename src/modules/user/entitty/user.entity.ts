import { Shared } from "../../../common/entity/shared";
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  Unique,
  OneToMany,
  RelationId,
} from "typeorm";
import { IsDefined, IsString, Length, IsEmail, IsEnum } from "class-validator";
import { UserType } from "../enum/IUserType";
import { ObjectType, InputType, Field, registerEnumType } from "@nestjs/graphql";

import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { Restaurants } from "../../restaurants/entity/restaurants.entity";
import { Order } from "../../order/entity/order.entity";
import { Payment } from "../../payment/entity/payment.entity";

registerEnumType(UserType, { name: "UserType" });

@InputType("UserInputType", { isAbstract: true })
@ObjectType()
@Entity("users")
@Unique(["email"])
export class User extends Shared {
  @Column("string")
  @Field(() => String)
  @IsDefined()
  @IsString()
  @Length(5, 30)
  @IsEmail()
  email: string;

  @Column("string", { select: false })
  @Field(() => String)
  @IsDefined()
  @IsString()
  @Length(7, 30)
  password: string;
  @Column({ type: "enum", enum: UserType, array: false })
  @IsEnum(UserType)
  @Field(() => UserType)
  role: UserType;

  private tempPassword: string;

  @Column("boolean", { default: false })
  @Field(() => Boolean)
  verified: boolean;

  @Field(() => [Restaurants])
  @OneToMany(
    () => Restaurants,
    restaurant => restaurant.owner,
  )
  restaurants: Restaurants[];

  @Column()
  @RelationId((user: User) => user.restaurants)
  restaurantsId: string[];

  @Field(() => [Order])
  @OneToMany(
    () => Order,
    (order: Order) => order.customer,
  )
  orders: Order[];

  @Column()
  @RelationId((user: User) => user.orders)
  ordersId: string[];

  @Field(() => [Order])
  @OneToMany(
    () => Order,
    (order: Order) => order.driver,
  )
  driver: Order[];

  @Column()
  @RelationId((user: User) => user.driver)
  driverId: string[];

  @Field(() => [Payment])
  @OneToMany(
    () => Payment,
    (payment: Payment) => payment.user,
    {
      eager: true,
    },
  )
  payments: Payment[];

  @Column()
  @RelationId((user: User) => user.payments)
  paymentsId: string[];

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(this.password, candidatePassword);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    // cheack if that password changing or not
    if (this.password) {
      if (this.tempPassword !== this.password) {
        try {
          this.password = await bcrypt.hash(this.password, 10);
        } catch (e) {
          throw new InternalServerErrorException("there are some issiue in the hash");
        }
      }
    }
  }
}
