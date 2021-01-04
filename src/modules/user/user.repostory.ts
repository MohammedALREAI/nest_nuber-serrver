import { Repository, EntityRepository } from "typeorm";
import { User } from "./entitty/user.entity";
import { CreateAccountInput, CreateAccountTypeOutput } from "./dots/createAccountDto";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GetUserIDOutputMutation } from "./dots/getUserById";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const emailUsed = await this.findOne({ email });
      if (!emailUsed) {
        throw new NotFoundException(`te email is not used`);
      }
      return emailUsed;
    } catch (e) {
      throw new BadRequestException("THRE ARE SOME HANDLE");
    }
  }
  async findUserById(id: string): Promise<GetUserIDOutputMutation> {
    try {
      const isUser = await this.findOne(id);
      if (!isUser) {
        return {
          ok: false,
          error: "there is some issuies",
        };
      }
      return {
        ok: true,
        user: isUser,
      };
    } catch (e) {
      return {
        ok: false,
        error: `there ${e}`,
      };
    }
  }
  async createAccount(data: CreateAccountInput): Promise<CreateAccountTypeOutput> {
    const { email, password, role } = data;
    ///CHEACK IF THE FOUND EAMIL  OR NOT
    const isUser = await this.findUserByEmail(email);
    if (!isUser) {
      ///create new user
      const newUser = this.create({
        email,
        password,
        role,
      });
      try {
        await newUser.save();
        return {
          ok: true,
        };
      } catch (e) {
        throw new BadRequestException("THRE ARE SOME HANDLE");
      }
    }
    return {
      ok: false,
      error: "user is found in the for this email ",
    };
  }
}
