import * as Joi from 'joi';

export const productSchema = Joi.object({
  type: Joi.string().optional(),
  name: Joi.string().required(),
  brand: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  quality: Joi.string().when('type', {
    is: Joi.string().valid('tile').equal(true),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  width: Joi.number().when('type', {
    is: Joi.string().valid('tile').equal(true),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  height: Joi.number().when('type', {
    is: Joi.string().valid('tile').equal(true),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export const productUpdateSchema = Joi.object({
  type: Joi.string().optional(),
  name: Joi.string().optional(),
  brand: Joi.string().optional(),
  price: Joi.number().optional(),
  quantity: Joi.number().optional(),
  quality: Joi.string().when('type', {
    is: Joi.string().valid('tile').equal(true),
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
  width: Joi.number().when('type', {
    is: Joi.string().valid('tile').equal(true),
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
  height: Joi.number().when('type', {
    is: Joi.string().valid('tile').equal(true),
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
});