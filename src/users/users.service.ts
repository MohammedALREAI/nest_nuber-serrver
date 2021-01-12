import { Injectable } from "@nestjs/common";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { UserRepository } from "./Repostory/user.repostory";

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createAccount(args: CreateAccountInput): Promise<CreateAccountOutput> {
    return this.userRepo.createAccount(args);
  }

  async login(args: LoginInput): Promise<LoginOutput> {
    return this.userRepo.login(args);
  }

  async findById(id: number): Promise<UserProfileOutput> {
    return this.userRepo.findById(id);
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.userRepo.editProfile(userId, { email, password });
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    return this.userRepo.verifyEmail(code);
  }
}
