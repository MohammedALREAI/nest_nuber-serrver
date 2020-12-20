import { ObjectType, Field, ID } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("restaurants")
export class Restaurants extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;
  @Field(() => String)
  @Column("string")
  name: string;
  @Field(() => String)
  @Column("string")
  address: string;
  @Field(() => Boolean)
  @Column("bool")
  isVegan: boolean;
  @Field(() => String)
  ownNumber: string;
}
