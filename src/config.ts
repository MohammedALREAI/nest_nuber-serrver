import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { MailModuleOptions } from "./mail/mail.interfaces";
import { GqlModuleOptions } from "@nestjs/graphql";
import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";
import { validationSchema } from "./helper/validationSchema";
import "reflect-metadata";

const db: TypeOrmModuleOptions = {
  name: "default",
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgress",
  database: process.env.DATABASE_DB,
  synchronize: true,
  logging: true,
  entities: [__dirname + "/**/entities/*.entity.{ts,js}"],
};

const MAILGUN_API_KEY = "4c222638e45f03cf2759bee7f8e41402-ea44b6dc-cc7de1bd";
const MAILGUN_DOMAIN_NAME = "sandbox970c22ff978c46d9b826cc095d3e6eb7.mailgun.org";
const MAILGUN_FROM_EMAIL = "sandbox970c22ff978c46d9b826cc095d3e6eb7.mailgun.org";

const configMail: MailModuleOptions = {
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN_NAME,
  fromEmail: MAILGUN_FROM_EMAIL,
};
const PRIVATE_KEY = "somEtEXX";

const configGraphQL: GqlModuleOptions = {
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

const configEnv: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: ".env.dev",
  ignoreEnvFile: true,
  validationSchema,
};
export default () => ({
  db,
  configMail,
  configGraphQL,
  configEnv,
  PRIVATE_KEY,
});
