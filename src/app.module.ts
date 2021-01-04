import { PaymentModule } from "./modules/payment/payment.module";
import { CommonModule } from "./common/modules/common.module";
import { OrderModule } from "./modules/order/order.module";
import { DishModule } from "./modules/dish/dish.module";
import { CategoryModule } from "./modules/category/category.module";
import { MailModule } from "./common/modules/mail/mail.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtModule } from "./modules/jwt/jwt.module";
import { UserModule } from "./modules/user/user.module";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConnectionService } from "./TypeOrmServicess";
import { config } from "./Myconfig";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),

    ConfigModule.forRoot(config.configModuleOptions),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),

    GraphQLModule.forRoot(config.gqlModuleOptions),
    JwtModule.forRoot({
      secretKey: process.env.TOKEN_SECRET,
    }),
    MailModule.forRoot(config.mailConfig),
    CommonModule,
    OrderModule,
    DishModule,
    CategoryModule,
    MailModule,
    AuthModule,
    UserModule,
    PaymentModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
