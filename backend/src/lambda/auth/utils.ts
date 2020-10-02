import { APIGatewayProxyEvent } from 'aws-lambda';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from '../auth/jwt.d'

/**
 * Get and parse user id from an API Gateway event
 * @param event an event from API Gateway
 * @returns a user id from a JWT token
 */
export default function getUserId(event: APIGatewayProxyEvent): string  {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const decodedJwt = decode(jwtToken) as JwtPayload;
  console.debug(authorization, split, jwtToken, decodedJwt);
  return decodedJwt.sub as string;
}
