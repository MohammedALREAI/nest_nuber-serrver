import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repostory";
import { CreateAccountInput, CreateAccountTypeOutput } from "./dots/createAccountDto";
import { LoginInputMutation, LoginOutputMutation } from "./dots/loginDto";
import { JwtService } from "../jwt/jwt.service";
import { EditProfileInputMutation, EditProfileOutputMutation } from "./dots/eaditProfile";
import { Verification } from "./entitty/verification.entity";
import { Repository } from "typeorm";
import { verificationInputMutation, verificationOutputMutation } from "./dots/verificationDto";
import { UserProfileInput, UserProfileOutput } from "./dots/userProfileInputDto";

@Injectable()
export class UserService {
  constructor(
    private readonly userRep: UserRepository,
    @InjectRepository(Verification) private readonly verificationRep: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  /***
   * verificationEmail
   * @data: verificationInputMutation
   *=> return ->verificationOutputMutation
   * steps
   * 1- //we need to find this verification
   */

  async verificationEmail(data: verificationInputMutation): Promise<verificationOutputMutation> {
    const { code } = data;
    //we nned to find theis verification
    try {
      const isVerification = await this.verificationRep.findOne(
        { code },
        {
          relations: ["user.verified"],
        },
      );
      if (!isVerification) {
        return {
          ok: false,
          error: `the user not found the this code`,
        };
      }
      isVerification.user.verified = true;
      await this.userRep.save(isVerification.user);
      return {
        ok: true,
        error: null,
      };
    } catch (e) {
      throw new InternalServerErrorException(`There are some issue to find ${e}`);
    }
  }

  /***
   * createAccount
   * @data: verificationInputMutation
   *=> return ->CreateAccountTypeOutput
   * steps
   * 1-     ///CHEACK IF THE FOUND EAMIL  OR NOT
   * if it not found  create one and make realtion with theverification
   */
  async createAccount(data: CreateAccountInput): Promise<CreateAccountTypeOutput> {
    const { email, password, role } = data;
    const isUser = await this.userRep.findUserByEmail(email);
    if (!isUser) {
      ///create new user
      const newUser = this.userRep.create({
        email,
        password,
        role,
      });
      try {
        await newUser.save();
        await this.verificationRep.save(this.verificationRep.create({ user: newUser }));

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

  /***
   * eadit profile
   * @userId: string,
   * @data: EditProfileInputMutation
   *=> return ->EditProfileOutputMutation
   * steps
   * 1- find the  user if it found it will be cahnge what you neeed
   */

  async editProfile(
    id: string,
    data: EditProfileInputMutation,
  ): Promise<EditProfileOutputMutation> {
    try {
      const { user, ok, error } = await this.userRep.findUserById(id);
      if (!user || ok === false || error) {
        return {
          ok,
          error,
        };
      }

      if (data.password) {
        user.password = data.password;
      }
      if (data.email) {
        user.password = data.email;
      }
      await this.userRep.save(user);

      return {
        ok: true,
        error: null,
      };
    } catch (e) {
      return {
        ok: false,
        error: `${e}`,
      };
    }
  }

  async user(data: UserProfileInput): Promise<UserProfileOutput> {
    const { userId } = data;
    try {
      const user = await this.userRep.findOne({ id: userId });
      if (!user) {
        return { ok: false, error: "cont find the user" };
      }
      return {
        ok: true,
        user,
        error: null,
      };
    } catch (e) {
      throw new NotFoundException(`THERE ARE SOME ISSSIURE TO HANDLE WITH ${e}`);
    }
  }

  /***
   * loginAccount
   * @data: LoginInputMutation
   *=> return ->LoginOutputMutation
   * steps
   * 1- //we need to find this find the email is found the
   * 2- cheack the password is match
   * 3 - genarate token
   */

  async loginAccount(data: LoginInputMutation): Promise<LoginOutputMutation> {
    const { email, password } = data;
    try {
      const isUser = await this.userRep.findOne(email, { select: ["password", "id"] });
      if (!isUser) {
        return {
          ok: false,
          error: " the email not found please make noe user or register",
        };
      }

      // the user found we need to comapre
      const matchPassord = await isUser.comparePassword(password);
      if (!matchPassord) {
        return {
          ok: false,
          error: " the password not match",
        };
      }
      const token = this.jwtService.sign(isUser.id);
      return {
        ok: true,
        error: null,
        token,
      };
    } catch (e) {}
  }

  async findUserById(id: string) {
    return this.userRep.findUserById(id);
  }
}
