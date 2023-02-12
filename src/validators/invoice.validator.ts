import * as Joi from 'joi';
import messages from '../config/messages';
import { PAYMENT_TYPES } from '../config/constants';

export const invoiceSchema = Joi.object({
  customerId: Joi.string().guid().required(),
  products: Joi.array().items({
    id: Joi.string().guid().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required()
  }).required(),
  payments: Joi.array().items({
    paymentType: Joi.string().required().equal(...PAYMENT_TYPES),
    amount: Joi.number().required(),
  }).min(1).required()
}).custom((value, helper) => {
  const { products, payments } = value;
  let netPayable = 0;

  products.forEach((product: any) => {
    netPayable += (product.quantity * product.price)
  });

  const amountsArray: number[] = payments.map((payment: any) => payment.amount);
  const totalPaid = amountsArray.reduce((total, amount) => total + amount, 0);

  if (totalPaid != netPayable)  throw new Error(messages.VALIDATION.INVOICE.PAYMENTS);

  return {...value, netPayable};
});