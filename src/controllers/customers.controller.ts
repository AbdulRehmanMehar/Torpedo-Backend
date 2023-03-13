import { Response } from 'express';
import { connectToDatabase } from '../config/db';
import { Auth0Middleware } from '../middlewares/auth0.middleware';
import { Controller, Get, Req, Res, UseBefore } from 'routing-controllers';

@UseBefore(Auth0Middleware)
@Controller('/customers')
export class ProductsController {

  @Get('/')
  async getCustomers(@Req() request: any, @Res() response: Response) {
    try {
      const { tenantId } = request.auth.currentUser.user_metadata;
      const { Customer } = await connectToDatabase(tenantId);
      const customers = await Customer.findAll();

      return response.json({
        customers
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }
}