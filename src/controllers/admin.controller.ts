import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Invoice, Tenant, User } from '../models';
import { Body, Controller, Get, Post, Req, Res, UseBefore } from 'routing-controllers';
import auth0, { createAdmin } from '../config/auth0';
import { adminSchema, tenantSchema } from '../validators';
import { Auth0Middleware } from '../middlewares/auth0.middleware';

@Controller('/admin')
export class AdminController {

  @Post('/create')
  async createAdmin(@Body() userInfo: any, @Res() response: Response) {
    try {
      const { value, error } = adminSchema.validate(userInfo);
      if (error) return response.status(400).json({ error });

      const { name, email, password } = value;

      let user = await User.findOne({
        where: { email }
      });

      if (user)
        return response.status(400).json({
          message: 'User already exists',
          user,
        });

      user = await User.create({
        name,
        email,
      });

      const resp = await createAdmin({
        name,
        email,
        password,
        id: user.id,
      });

      return response.status(200).json({
        resp,
        user,
      });
    } catch (error) {
      console.log({ error });

      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }

  @UseBefore(Auth0Middleware)
  @Post('/create/tenant')
  async createTenant(@Body() tenantInfo: any, @Req() request: Request & {auth: any}, @Res() response: Response) {
    try {

      return response.status(200).json({
        tenant: request.auth.currentUser
      });

      const { value, error } = tenantSchema.validate(tenantInfo);
      if (error) return response.status(400).json({ error });

      const { name } = value;

      let tenant = await Tenant.findOne({
        where: { name }
      });

      if (tenant)
        return response.status(400).json({
          message: 'Tenant already exists',
          tenant,
        });


      tenant = await Tenant.create({
        name,
      });

      return response.status(200).json({
        tenant
      });
    } catch (error) {
      console.log({ error });

      return response.status(500).json({
        message: 'Something went wrong',
        error
      });
    }
  }
}