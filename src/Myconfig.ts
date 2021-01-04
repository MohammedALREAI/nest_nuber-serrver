import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";
import { GqlModuleOptions } from "@nestjs/graphql";
import { validationSchema } from "./common/helper/validationSchema";
import { IMailOptions } from "./common/modules/mail/interface/IMail";
const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  ignoreEnvFile: true,
  validationSchema,
  envFilePath: process.env.NODE_ENV === "dev" ? ".dev.env" : ".test.env",
};

const gqlModuleOptions: GqlModuleOptions = {
  autoSchemaFile: true,
  playground: true,
  installSubscriptionHandlers: true,

  context: ({ req, connection }) => {
    const TOKEN_KEY = "x-jwt";

    return {
      token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
    };
  },
};

export const mailConfig: IMailOptions = {
  apikey: process.env.MAILGUN_APIKEY,
  domain: process.env.MAILGUN_DOMAIN,
  fromEmail: process.env.MAILGUN_MAIL_FOR,
};

export const config = {
  configModuleOptions,
  gqlModuleOptions,
  mailConfig,
};
