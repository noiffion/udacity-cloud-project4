import { JwtHeader } from 'jsonwebtoken';

export interface JwtPayload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface Jwt {
  header: JwtHeader;
  payload: JwtPayload;
}
