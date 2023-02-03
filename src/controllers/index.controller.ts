import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Invoice } from '../models';
import { Body, Controller, Get, Post, Req, Res } from 'routing-controllers';
import { generateToken } from '../config/auth0';

@Controller()
export class IndexController {

  @Get('/')
  async getApi(@Req() request: any, @Res() response: Response) {
    return response.send('Application is live...');
  }

  @Post('/login')
  async login(@Body() userInfo: any, @Res() response: Response) {
    const token = await generateToken({ email: userInfo.email, password: userInfo.password });
    return response.json({
      token
    });
  }

}