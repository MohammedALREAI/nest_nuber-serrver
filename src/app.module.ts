import { Config } from "./config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "./jwt/jwt.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { RestaurantsModule } from "./restaurants/restaurants.module";
import { OrdersModule } from "./orders/orders.module";
import { CommonModule } from "./common/common.module";
import { PaymentsModule } from "./payments/payments.module";
import { ScheduleModule } from "@nestjs/schedule";
import { UploadsModule } from "./uploads/uploads.module";
import { DatabaseConnectionService } from "./DatabaseConnection";
@Module({
  imports: [
    ConfigModule.forRoot(Config.Env),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
    GraphQLModule.forRoot(Config.GraphQL),
    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privateKey: Config.JWT.apikey,
    }),
    MailModule.forRoot(Config.MAIL),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
