import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./entitty/user.entity";
import { CreateAccountInput, CreateAccountTypeOutput } from "./dots/createAccountDto";
import { LoginInputMutation } from "./dots/loginDto";
import { AuthUser } from "../../common/decorator/auth.decorator";
import { UserProfileInput, UserProfileOutput } from "./dots/userProfileInputDto";
import { EditProfileOutputMutation, EditProfileInputMutation } from "./dots/eaditProfile";
import { verificationOutputMutation, verificationInputMutation } from "./dots/verificationDto";
import { Role } from "../../common/decorator/role.decorator";
import { PUB_SUB } from "../../common/common.constat";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
@Resolver(User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pusSub: PubSub,
  ) {}

  @Mutation(() => CreateAccountTypeOutput)
  async createAccount(@Args("data") data: CreateAccountInput): Promise<CreateAccountTypeOutput> {
    return this.userService.createAccount(data);
  }

  /***
   * loginAccount
   * @data: LoginInputMutation
   *=> return ->loginAccount
   */

  @Mutation(() => CreateAccountTypeOutput)
  async loginAccount(@Args("data") data: LoginInputMutation): Promise<CreateAccountTypeOutput> {
    return this.userService.loginAccount(data);
  }
  /***
   * me Qyery
   * @data: ---
   *=> return ->User
   */

  @Query(() => User)
  @Role(["Any"])
  me(@AuthUser() user: User) {
    return user;
  }

  /***
   * user
   * @data: LoginInputMutation
   *=> return ->loginAccount
   */
  @Role(["Any"])
  @Query(() => UserProfileOutput)
  async user(@Args() data: UserProfileInput): Promise<UserProfileOutput> {
    return this.user(data);
  }

  /***
   * editProfile
   * @data: EditProfileInputMutation
   *=> return ->EditProfileOutputMutation
   */
  @Mutation(() => EditProfileOutputMutation)
  @Role(["Any"])
  async editProfile(@AuthUser() user: User, @Args() data: EditProfileInputMutation) {
    return this.userService.editProfile(user.id, data);
  }

  /***
   * verificationEmail
   * @data: verificationInputMutation
   *=> return ->verificationOutputMutation
   */
  @Mutation(() => verificationOutputMutation)
  async verificationEmail(@Args() data: verificationInputMutation) {
    this.userService.verificationEmail(data);
  }
}
