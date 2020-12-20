import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConnectionService } from "./TypeOrmServicess";
import { validationSchema } from "./common/helper/validationSchema";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validationSchema,
      envFilePath: process.env.NODE_ENV === "dev" ? ".dev.env" : ".test.env",
    }),

    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
