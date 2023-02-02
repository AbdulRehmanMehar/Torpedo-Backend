import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Invoice, Payment, Product } from '../models';
import { Body, Controller, Get, Post, Req, Res } from 'routing-controllers';
import { productSchema } from '../validators';

@Controller('/products')
export class ProductsController {

  @Get('/')
  async getProducts(@Req() request: any, @Res() response: Response) {
    try {
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
  async addProduct(@Body() productData: any, @Res() response: Response) {
    try {

      const { value, error } = productSchema.validate(productData);

      if (error) return response.status(400).json({ error });

      const {
        name,
        price,
        width,
        height,
      } = value;

      const product = await Product.create({
        name,
        price,
        width,
        height
      });

      return response.status(200).json({
        product
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }
}