import { JWTPayload } from 'jose/dist/types/types';

export enum JwtClaims {
  Login = 1,
  Signup = 2,
}

export interface SignupJwtClaims extends JWTPayload {
  type: JwtClaims.Signup;
  firstName: string;
  lastName: string;
}

export class Auth0UserDto {
  email: string;
  // This is the auth0 app where we are registered
  tenant: string;
  // Auth0 specific id
  user_id: string;
}
