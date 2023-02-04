import { Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { Body, Controller, Get, Post, Req, Res, UseBefore } from 'routing-controllers';
import auth0, { createAdmin, updateUserMeta } from '../config/auth0';
import { adminSchema, tenantSchema } from '../validators';
import { Auth0Middleware } from '../middlewares/auth0.middleware';
import { connectToDatabase } from '../config/db';

@Controller('/admin')
export class AdminController {

  @Post('/create')
  async createAdmin(@Body() userInfo: any, @Res() response: Response) {
    try {
      const { value, error } = adminSchema.validate(userInfo);
      if (error) return response.status(400).json({ error });

      const { User } = await connectToDatabase('admin');

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
      const userEmail = request.auth.currentUser.email;
      const userId = request.auth.currentUser.user_metadata.userId;
      console.log(userId);
      
      if (!userId)
        return response.status(400).json({
          message: 'Something went wrong',
        });

      const { value, error } = tenantSchema.validate(tenantInfo);
      if (error) return response.status(400).json({ error });

      const { Tenant, User } = await connectToDatabase('admin');
      const { name } = value;

      let tenant = await Tenant.findOne({
        attributes: ['name'],
        where: { name }
      });

      if (tenant)
        return response.status(400).json({
          message: 'Tenant already exists',
          tenant,
        });


      tenant = await Tenant.create({
        name,
        adminId: userId,
      }, { returning: ['id'] });

      await updateUserMeta({email: userEmail, tenantId: tenant.id});

      await User.update({
        tenantId: tenant.id,
      }, {
        where: {
          id: userId
        }
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