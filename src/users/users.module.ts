import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserResolver } from "./users.resolver";
import { UserService } from "./users.service";
import { UserRepository } from "./Repostory/user.repostory";
import { VerificationRepository } from "./Repostory/verifications.repostory";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, VerificationRepository])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
