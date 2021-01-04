import { Entity, Column, JoinColumn, OneToOne, BeforeInsert } from "typeorm";
import { InputType, ObjectType, Field } from "@nestjs/graphql";
import { Shared } from "../../../common/entity/shared";
import { User } from "./user.entity";
import { v4 as uuidv4 } from "uuid";
@InputType("VerificationInputType", { isAbstract: true })
@ObjectType()
@Entity("verification")
export class Verification extends Shared {
  @Column("string")
  @Field(() => String)
  code: string;
  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  //this will be create the code
  @BeforeInsert()
  letGenareateCode() {
    const hah = uuidv4() as string;
    this.code = hah.replace("-", "");
  }
}
