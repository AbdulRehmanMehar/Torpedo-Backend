import { Response, Request } from 'express';
import { productSchema, productUpdateSchema } from '../validators';
import { connectToDatabase } from '../config/db';
import { Auth0Middleware } from '../middlewares/auth0.middleware';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res, UseBefore } from 'routing-controllers';
import { PAGINATION_LIMIT } from '../config/constants';

@UseBefore(Auth0Middleware)
@Controller('/products')
export class ProductsController {

  @Get('/')
  async getProducts(@QueryParam('pageNumber') pageNumber: number,  @Req() request: any, @Res() response: Response) {
    try {
      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Product } = await connectToDatabase(tenantId);
      const queryReponse = await Product.findAndCountAll({
        limit: PAGINATION_LIMIT,
        offset: PAGINATION_LIMIT * ((pageNumber || 1) -1),
        order: [['updatedAt', 'DESC']]
      });

      return response.json({
        products: queryReponse.rows,
        total: queryReponse.count
      });
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }

  @Get('/:productId')
  async getSingleProduct(@Param('productId') productId: string, @Req() request: any, @Res() response: Response) {
    try {
      const { userId, encKey, tenantId } = request.auth.currentUser.user_metadata;
      const { Product } = await connectToDatabase(tenantId);
      const product = await Product.findByPk(productId);

      return response.json({
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
  async updateProduct(@Param('productId') productId: string, @Body() productData: any, @Req() request: any, @Res() response: Response) {
    try {

      if (!productId)
        return response.status(400).json({ error: 'Product Id was not provided' });

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

      const product = await Product.findByPk(productId);

      const newData = {
        name: name || product.name,
        price: price || product.price,
        width: type === 'Tile' ? width || product.width : null,
        height: type === 'Tile' ? height || product.height : null,
        type: type,
        brand: brand || product.brand,
        quality: type !== 'Tile' ? quality || product.quality: null,
        quantity: quantity || product.quantity,
      };

      const updatedProduct = await product.update(newData);

      return response.status(200).json({
        product: updatedProduct
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
  async deleteProduct(@Param('productId') productId: string, @Req() request: any, @Res() response: Response) {
    try {
      if (!productId)
        return response.status(400).json({ error: 'Product Id was not provided' });

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