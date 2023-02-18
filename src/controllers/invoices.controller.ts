import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { invoiceSchema } from '../validators';
import { connectToDatabase } from '../config/db';
import { Auth0Middleware } from '../middlewares/auth0.middleware';
import { Body, Controller, Get, Middleware, Post, Req, Res, UseBefore } from 'routing-controllers';
import { ModelStatic } from 'sequelize';

@UseBefore(Auth0Middleware)
@Controller('/invoices')
export class InvoicesController {

  @Get('/')
  async getInvoices(@Req() request: any, @Res() response: Response) {
    try {
      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Invoice, Payment, InvoiceItem, Product } = await connectToDatabase(tenantId);

      const invoices = await Invoice.findAll({
        include: [Payment, {
          model: InvoiceItem,
          include: [Product]
        }]
      });

      return response.json({
        invoices
      });
    } catch (error) {
      console.log(error);

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
      const { Invoice, Payment, Customer, InvoiceItem, Product } = await connectToDatabase(tenantId);

      const { value, error } = invoiceSchema.validate(invoiceData);
      if (error) return response.status(400).json({ error });

      const {
        netPayable,
        payments,
        products,
        customer: { phone: customerPhone, name: customerName },
      } = value;

      let customer = await Customer.findOne({
        where: {
          phone: customerPhone,
        }
      });

      if (!customer) {
        customer = await Customer.create({
          name: customerName,
          phone: customerPhone,
          tenantId,
        }, { returning: true });
      }

      const invoice = await Invoice.create({
        customerId: customer.id,
        netPayable,
        tenantId,
      });

      const productsObj = await Promise.all(products.map((product: any) => (
        Product.findByPk(product.id)
      )));

      const invoiceItems = await Promise.all(products.map((product: any) => (
        InvoiceItem.create({
          productId: product.id,
          price: product.price,
          quantity: product.quantity,
          invoiceId: invoice.id,
          defaultProductPrice: productsObj.find((prod) => prod.id === product.id).price,
          tenantId,
        })
      )));

      const paymentList = await Promise.all(
        payments.map( ({ paymentType, amount }: any) => Payment.create({
          paymentType,
          amount,
          invoiceId: invoice.id,
          tenantId
        }))
      );

      return response.status(200).json({
        invoice: {
          ...(invoice.get({ plain: true })),
          payments: paymentList,
          products: invoiceItems,
          customer,
        }
      });
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }
}