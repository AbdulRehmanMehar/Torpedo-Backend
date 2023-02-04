import { auth } from 'express-oauth2-jwt-bearer';
import { ManagementClient, AuthenticationClient } from 'auth0';
import { generateEncryptionKey } from './cryptr';

const {
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_CONNECTION,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER_BASE_URL,
  AUTH0_TOKEN_SIGNING_ALGO,
  AUTH0_MANAGEMENT_AUDIENCE,
  AUTH0_MANAGEMENT_CLIENT_ID,
  AUTH0_MANAGEMENT_CLIENT_SECRET,
} = process.env;



export const managementClient = new ManagementClient({
  domain: AUTH0_DOMAIN,
  audience: AUTH0_MANAGEMENT_AUDIENCE,
  clientId: AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: AUTH0_MANAGEMENT_CLIENT_SECRET,
  // scope: "read:users write:users",
  tokenProvider: {
    enableCache: true,
    cacheTTLInSeconds: 10
  }
});

export const authClient = new AuthenticationClient({
  domain: AUTH0_DOMAIN,
  // audience: AUTH0_MANAGEMENT_AUDIENCE,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  // scope: "read:users write:users",
  // tokenProvider: {
  //   enableCache: true,
  //   cacheTTLInSeconds: 10
  // }
});
export interface Auth0User {
  id?: string;
  name: string;
  email: string;
  password: string;
  tenantId?: string;
  encKey?: string;
}

export const createUser = async (userInfo: Auth0User) => {
  return managementClient.createUser({
    name: userInfo.name,
    email: userInfo.email,
    user_metadata: {
      tenantId: userInfo.tenantId,
    },
    connection: AUTH0_CONNECTION,
  });
}

export const createAdmin = async (userInfo: Auth0User) => {
  return managementClient.createUser({
    name: userInfo.name,
    email: userInfo.email,
    password: userInfo.password,
    connection: AUTH0_CONNECTION,
    user_metadata: {
      userId: userInfo.id,
      encKey: generateEncryptionKey(userInfo.id)
    }
  });
}

export const updateUserMeta = async (userInfo: { email: string, tenantId: string }) => {
  const user = (await managementClient.getUsersByEmail(userInfo.email))[0];

  if (!user || (user || {}).email !== userInfo.email) throw new Error('Something went wrong.');

  return managementClient.updateUser({
    id: user.user_id,
  }, {
    connection: AUTH0_CONNECTION,
    user_metadata: {
      tenantId: userInfo.tenantId
    }
  });
}

export const generateToken = async (userInfo: Omit<Auth0User, 'name'>) => {
  return authClient.passwordGrant({
    username: userInfo.email,
    password: userInfo.password
  });
}

export const getUserById = async (id: string) => {
  return managementClient.getUser({ id });
}

const jwtCheck = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: AUTH0_TOKEN_SIGNING_ALGO
});

export default jwtCheck;