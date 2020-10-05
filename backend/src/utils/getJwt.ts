import { APIGatewayProxyEvent } from 'aws-lambda';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from '../lambda/auth/jwt';

/**
 * Get JWT token from an API Gateway event
 * @param event an event from API Gateway
 * @returns JWT token string
 */
export function getToken(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  return jwtToken;
}

/**
 * Get and parse user id from an JWT token
 * @param jwtToken a JWT token string
 * @returns a user id from the token
 */
export function getUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload;
  return decodedJwt.sub as string;
}
