import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { MailModuleOptions } from "./mail/mail.interfaces";
import { GqlModuleOptions } from "@nestjs/graphql";
import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";
import { validationSchema } from "./helper/validationSchema";
import "reflect-metadata";
import { config } from "dotenv";
config();

export namespace Config {
  export const DB: TypeOrmModuleOptions = {
    name: "default",
    type: "postgres",
    ssl: {
      rejectUnauthorized: false,
    },
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    synchronize: true,
    logging: true,
    entities: [__dirname + "/**/entities/*.entity.{ts,js}"],
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

  export const GraphQL: GqlModuleOptions = {
    playground: true,
    installSubscriptionHandlers: true,
    autoSchemaFile: true,
    context: ({ req, connection }) => {
      const TOKEN_KEY = "x-jwt";
      return {
        token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
      };
    },
  };

  export const Env: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: ".env.dev",
    ignoreEnvFile: true,
  };
}
