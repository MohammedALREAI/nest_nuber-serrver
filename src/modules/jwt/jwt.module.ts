import { Module, DynamicModule, Global } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { IJwtOption } from "./interface/IJwtOptions";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../../common/Guards/auth.guard";

@Global()
@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [APP_GUARD],
})
export class JwtModule {
  static forRoot(options: IJwtOption): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [JwtService, UserService],
    };
  }
}
