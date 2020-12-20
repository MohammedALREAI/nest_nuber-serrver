import * as Joi from "joi";

export const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_DB: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
});
