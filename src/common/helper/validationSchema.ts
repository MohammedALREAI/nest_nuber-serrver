import * as Joi from "joi";

export const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_DB: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  TOKEN_SECRET: Joi.string().required(),
  MAILGUN_APIKEY: Joi.string().required(),
  MAILGUN_DOMAIN: Joi.string().required(),
  MAILGUN_MAIL_FOR: Joi.string().required(),
});
