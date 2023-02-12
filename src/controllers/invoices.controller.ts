import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { invoiceSchema } from '../validators';
import { connectToDatabase } from '../config/db';
import { Auth0Middleware } from '../middlewares/auth0.middleware';
import { Body, Controller, Get, Middleware, Post, Req, Res, UseBefore } from 'routing-controllers';

@UseBefore(Auth0Middleware)
@Controller('/invoices')
export class InvoicesController {

  @Get('/')
  async getInvoices(@Req() request: any, @Res() response: Response) {
    try {
      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Invoice, Payment } = await connectToDatabase(tenantId);

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
  async addInvoice(@Body() invoiceData: any, @Req() request: any, @Res() response: Response) {
    try {
      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Invoice, Payment, Customer, InvoiceItem } = await connectToDatabase(tenantId);

      const { value, error } = invoiceSchema.validate(invoiceData);
      if (error) return response.status(400).json({ error });

      const {
        customerPhone,
        netPayable,
        payments,
        products
      } = value;

      let customer = await Customer.findOne({
        where: {
          phone: customerPhone,
        }
      });

      if (!customer) {
        return response.status(400).json({
          message: 'Customer doesn\'t exist',
          error
        });
      }

      const invoice = await Invoice.create({
        customerId: customer.id,
        netPayable,
        tenantId,
      });

      const invoiceItems = await Promise.all(products.map((product: any) => (
        InvoiceItem.create({
          productId: product.id,
          price: product.price,
          quantity: product.quantity,
          invoiceId: invoice.id,
          tenantId,
        })
      )));

      const paymentList = await Promise.all(
        payments.map( ({ paymentType, amount }: any) => Payment.create({
          id: uuidV4(),
          paymentType,
          amount,
          invoiceId: invoice.id
        }))
      );

      await invoice.$set('payments', [...paymentList]);
      await invoice.$set('invoiceItems', [...paymentList]);
      await invoice.$set('customer', customer);

      return response.status(200).json({
        invoice: {
          ...(invoice.get({ plain: true })),
          payments: paymentList,
          invoiceItems,
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