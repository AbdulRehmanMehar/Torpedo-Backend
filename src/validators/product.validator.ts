import * as Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string().optional(),
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