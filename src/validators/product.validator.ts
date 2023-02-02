import * as Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string().required(),
  width: Joi.number().when('type', {
    is: Joi.string().equal('tile'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  height: Joi.number().when('type', {
    is: Joi.string().equal('tile'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});