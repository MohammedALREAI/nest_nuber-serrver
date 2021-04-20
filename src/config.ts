import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { MailModuleOptions } from "./mail/mail.interfaces";
import { GqlModuleAsyncOptions } from "@nestjs/graphql";
import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";
import "reflect-metadata";
import { config } from "dotenv";
config();

export namespace Config {
  export const DB: TypeOrmModuleOptions = {
    name: "default",
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: true,
    // ssl:true,
    logging: true,
    entities: [__dirname + "/**/entities/*.entity.{ts,js}"],
    migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
    migrationsRun: false,
    maxQueryExecutionTime: 0.1 /** To log request runtime */,
    cli: {
      migrationsDir: __dirname + "/migrations/**/*{.ts,.js}",
    },
  };

  export const MAIL: MailModuleOptions = {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN_NAME,
    fromEmail: process.env.MAILGUN_FROM_EMAIL,
  };
  export const AWS = {
    AWS_KEY: process.env.AWS_KEY,
    AWS_SECRET: process.env.AWS_SECRET,
  };
  export const JWT = {
    apikey: process.env.PRIVATE_KEY,
  };

  export const CONFIG_OPTIONS = "CONFIG_OPTIONS";
  export const PUB_SUB = "PUB_SUB";
  export const NEW_PENDING_ORDER = "NEW_PENDING_ORDER";
  export const NEW_COOKED_ORDER = "NEW_COOKED_ORDER";
  export const NEW_ORDER_UPDATE = "NEW_ORDER_UPDATE";

  export const GraphQL: GqlModuleAsyncOptions = {
    useFactory: () => ({
      playground: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      cors: {
        origin: true,
        credentials: true,
      },
      subscriptions: {},

      context: ({ req, connection }) => {
        const TOKEN_KEY = "x-jwt";
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
    }),
  };

  export const Env: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: ".env.dev",
    ignoreEnvFile: true,
  };

  export const LOGGER_SETTINGS = {
    level: "info",
    silence: ["healthz", "IntrospectionQuery"],
  };
}
