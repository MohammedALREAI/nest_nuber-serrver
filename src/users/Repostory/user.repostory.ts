import { User } from "../entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateAccountInput, CreateAccountOutput } from "../dtos/create-account.dto";
import { JwtService } from "../../jwt/jwt.service";
import { MailService } from "../../mail/mail.service";
import { LoginInput, LoginOutput } from "../dtos/login.dto";
import { UserProfileOutput } from "../dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "../dtos/edit-profile.dto";
import { VerifyEmailOutput } from "../dtos/verify-email.dto";
import { EnumUserError } from "../Enum/errorUserEnum";
import { VerificationRepository } from "./verifications.repostory";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(
    private readonly verifications: VerificationRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    super();
  }
  async createAccount(args: CreateAccountInput): Promise<CreateAccountOutput> {
    const { email, password, role } = args;
    try {
      const exists = await this.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: EnumUserError.EMAIL_IS_USED,
        };
      }
      const user = await this.save(this.create({ email, password, role }));
      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      this.mailService.sendVerificationEmail(email, verification.code);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login(args: LoginInput): Promise<LoginOutput> {
    const { email, password } = args;
    try {
      const user = await this.findOne({ email }, { select: ["id", "password"] });
      if (!user) {
        return {
          ok: false,
          error: EnumUserError.USER_NOT_FOUND,
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: EnumUserError.WARRING_PASSWORD,
        };
      }

      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't log user in.",
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.findOneOrFail({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: "User Not Found" };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.findOne(userId);
      if (email) {
        user.email = email;
        user.verified = false;
        await this.verifications.delete({ user: { id: user.id } });
        const verification = await this.verifications.save(this.verifications.create({ user }));

        this.mailService.sendVerificationEmail(email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: EnumUserError.UPDATE_PROFILE_ERROR,
      };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({ code }, { relations: ["user"] });
      if (verification) {
        verification.user.verified = true;
        await this.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: "Verification not found." };
    } catch (error) {
      return { ok: false, error: "Could not verify email." };
    }
  }
}
