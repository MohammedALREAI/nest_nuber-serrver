import * as Joi from "joi";
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("dev", "production", "test")
    .required(),
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.string(),
  DATABASE_USER: Joi.string(),
  DATABASE_PASSWORD: Joi.string(),
  DATABASE_DB: Joi.string(),
  PRIVATE_KEY: Joi.string().required(),
  MAILGUN_API_KEY: Joi.string().required(),
  MAILGUN_DOMAIN_NAME: Joi.string().required(),
  MAILGUN_FROM_EMAIL: Joi.string().required(),
  AWS_KEY: Joi.string().required(),
  AWS_SECRET: Joi.string().required(),
});
