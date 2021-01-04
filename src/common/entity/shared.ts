import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field } from "@nestjs/graphql";

@Entity()
export abstract class Shared extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  id: string;
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;
}
