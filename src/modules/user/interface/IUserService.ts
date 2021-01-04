import { CreateAccountInput, CreateAccountTypeOutput } from "../dots/createAccountDto";
import { User } from "../entitty/user.entity";
import { LoginInputMutation, LoginOutputMutation } from "../dots/loginDto";
import { verificationInputMutation, verificationOutputMutation } from "../dots/verificationDto";

export interface IUserService {
  loginAccount(data: LoginInputMutation): Promise<LoginOutputMutation>;
  findUserByEmail(email: string): Promise<User>;
  findUserById(id: string): Promise<User>;
  seeProfile(): Promise<any>;
  editProfile(): Promise<any>;
  verifyEmail(): Promise<any>;
  createAccount(data: CreateAccountInput): Promise<CreateAccountTypeOutput>;

  verificationEmail(data: verificationInputMutation): Promise<verificationOutputMutation>;
}
