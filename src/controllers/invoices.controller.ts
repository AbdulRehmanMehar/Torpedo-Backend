import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Invoice, Payment } from '../models';
import { Body, Controller, Get, Middleware, Post, Req, Res, UseBefore } from 'routing-controllers';
import { invoiceSchema } from '../validators';
import { Auth0Middleware } from '../middlewares/auth0.middleware';
@UseBefore(Auth0Middleware)
@Controller('/invoices')
export class InvoicesController {

  @Get('/')
  async getInvoices(@Req() request: any, @Res() response: Response) {
    try {
      const invoices = await Invoice.findAll({
        include: [Payment]
      });

      return response.json({
        invoices
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }

  @Post('/add')
  async addInvoice(@Body() invoiceData: any, @Res() response: Response) {
    try {

      const { value, error } = invoiceSchema.validate(invoiceData);

      if (error) return response.status(400).json({ error });

      const {
        productName,
        customerName,
        customerPhone,
        productPrice,
        productQuantity,
        productMeasurements,
        netPayable,
        payments
      } = value;

      const invoice = await Invoice.create({
        id: uuidV4(),
        customerName,
        customerPhone,
        netPayable,
        productMeasurements,
        productName,
        productPrice,
        productQuantity,
      });

      const paymentList = await Promise.all(
        payments.map( ({ paymentType, amount }: any) => Payment.create({
          id: uuidV4(),
          paymentType,
          amount,
          invoiceId: invoice.id
        }))
      );

      await invoice.$set('payments', [...paymentList]);

      return response.status(200).json({
        invoice: {
          ...(invoice.get({ plain: true })),
          payments: paymentList
        }
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }
}