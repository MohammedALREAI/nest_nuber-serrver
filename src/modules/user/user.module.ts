import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { JwtModule } from "../jwt/jwt.module";
import { Verification } from "./entitty/verification.entity";
import { UserRepository } from "./user.repostory";
import { UserResolver } from "./user.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, Verification]), JwtModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
