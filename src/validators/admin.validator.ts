import * as Joi from 'joi';

export const adminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const tenantSchema = Joi.object({
  name: Joi.string().required(),
});