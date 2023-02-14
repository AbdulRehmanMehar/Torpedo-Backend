import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Invoice } from '../models';
import { Body, Controller, Get, Post, Req, Res } from 'routing-controllers';
import { generateToken, getUserByEmail } from '../config/auth0';
import { connectToDatabase } from '../config/db';

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

}