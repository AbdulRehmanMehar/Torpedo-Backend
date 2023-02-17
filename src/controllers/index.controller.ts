import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Invoice } from '../models';
import { Body, Controller, Get, Post, Req, Res, UseBefore } from 'routing-controllers';
import { generateToken, getUserByEmail } from '../config/auth0';
import { connectToDatabase } from '../config/db';
import { Auth0Middleware } from '../middlewares';

@Controller()
export class IndexController {

  @Get('/')
  async getApi(@Req() request: any, @Res() response: Response) {
    const { sequelize } = await connectToDatabase('admin');
    return response.send('Application is live...');
  }

  @Post('/login')
  async login(@Body() userInfo: any, @Res() response: Response) {
    try {
      const { access_token: token } = await generateToken({ email: userInfo.email, password: userInfo.password });
      const user = await getUserByEmail(userInfo.email);
      
      let tenant;
      if (user) {
        const { Tenant } = await connectToDatabase('admin');
        tenant = await Tenant.findByPk(user.user_metadata.tenantId, { raw: true });
      }

      return response.json({
        token,
        user: {
          email: user.email,
          name: user.name,
        },
        tenant
      });
    } catch (error) {
      const resp = JSON.parse(error.message);
      return response.status(500).json(resp);
    }
  }

  @Get('/suggestions')
  @UseBefore(Auth0Middleware)
  async getSuggestions(@Req() request: any, @Res() response: Response) {
    const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
    const { Invoice, Payment, InvoiceItem, Product, Sequelize, sequelize } = await connectToDatabase(tenantId);
    
    const [distinctProductValues] = await sequelize.query(`
      SELECT 
      ARRAY(SELECT DISTINCT("products"."brand") FROM "products" WHERE "products"."brand" IS NOT NULL) AS "brand",
      ARRAY(SELECT DISTINCT("products"."name") FROM "products" WHERE "products"."name" IS NOT NULL) AS "name",
      ARRAY(SELECT DISTINCT("products"."width") FROM "products" WHERE "products"."width" IS NOT NULL) AS "width",
      ARRAY(SELECT DISTINCT("products"."height") FROM "products" WHERE "products"."height" IS NOT NULL) AS "height",
      ARRAY(SELECT DISTINCT("products"."quantity") FROM "products" WHERE "products"."quantity" IS NOT NULL) AS "quantity",
      ARRAY(SELECT DISTINCT("products"."price") FROM "products" WHERE "products"."price" IS NOT NULL) AS "price";
    `, { raw: true });


    return response.json({
      products: distinctProductValues[0],
      invoices: {}
    });
  }
}