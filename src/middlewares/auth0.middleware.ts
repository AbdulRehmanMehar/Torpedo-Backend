import { compose } from 'compose-middleware';
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import jwtCheck, { getUserById } from '../config/auth0';

@Middleware({ type: 'before', priority: 99 })
export class Auth0Middleware implements ExpressMiddlewareInterface {
  public use(request: any, response: any, next?: (err?: any) => any): any {

    const auth0 = async (req: any, res: any, next: any) => {
      if (!req.auth || !(req.auth || {}).payload || !((req.auth || {}).payload || {}).sub)
        next(new Error('Token validation failed'));

      req.auth.currentUser = await getUserById(req.auth.payload.sub);
      next();
    };
    return compose([jwtCheck, auth0])(request, response, next);
  }
}