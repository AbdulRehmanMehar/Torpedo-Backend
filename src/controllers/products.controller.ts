import { Response, Request } from 'express';
import { productSchema, productUpdateSchema } from '../validators';
import { connectToDatabase } from '../config/db';
import { Auth0Middleware } from '../middlewares/auth0.middleware';
import { Body, Controller, Delete, Get, Post, Put, QueryParam, Req, Res, UseBefore } from 'routing-controllers';

@UseBefore(Auth0Middleware)
@Controller('/products')
export class ProductsController {

  @Get('/')
  async getProducts(@Req() request: any, @Res() response: Response) {
    try {
      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Product } = await connectToDatabase(tenantId);
      const products = await Product.findAll();

      return response.json({
        products
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }

  @Post('/add')
  async addProduct(@Body() productData: any, @Req() request: any, @Res() response: Response) {
    try {
      const { value, error } = productSchema.validate(productData);
      if (error) return response.status(400).json({ error });

      const {
        name,
        price,
        width,
        height,
        type,
        brand,
        quality,
        quantity
      } = value;

      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Product } = await connectToDatabase(tenantId);

      const product = await Product.create({
        name,
        price,
        width,
        height,
        tenantId,
        type,
        quality,
        quantity,
        brand
      });

      return response.status(200).json({
        product
      });
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }

  @Put('/update/:productId')
  async updateProduct(@QueryParam('productId') productId: string, @Body() productData: any, @Req() request: any, @Res() response: Response) {
    try {
      const { value, error } = productUpdateSchema.validate(productData);
      if (error) return response.status(400).json({ error });

      const {
        name,
        price,
        width,
        height,
        type,
        brand,
        quality,
        quantity
      } = value;

      const { tenantId } = request.auth.currentUser.user_metadata;
      const { Product } = await connectToDatabase(tenantId);

      const product = await Product.update({
        name,
        price,
        width,
        height,
        tenantId,
        type,
        quality,
        quantity,
        brand
      }, {
        where: {
          id: productId
        }
      });

      return response.status(200).json({
        product
      });
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }

  @Delete('/delete/:productId')
  async deleteProduct(@QueryParam('productId') productId: string, @Req() request: any, @Res() response: Response) {
    try {
      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Product } = await connectToDatabase(tenantId);

      await Product.destroy({
        where: {
          id: productId,
        },
      });

      return response.json({
        message: 'Deleted the product'
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }
}