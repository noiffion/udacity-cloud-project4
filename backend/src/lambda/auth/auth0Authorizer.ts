import 'source-map-support/register';
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import { verify } from 'jsonwebtoken';
import { createLogger } from '../../utils/logger';
import { JwtPayload } from './jwt.d';

const logger = createLogger('auth');

// Auth0 certificate to verify JWT token signature
// Auth0: Advanced Settings: Endpoints: JSON Web Key Set
const jwksUrl = 'https://dev-jyq4bnwu.eu.auth0.com/.well-known/jwks.json';

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info('User was authorized', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    };
  } catch (e) {
    logger.error('User not authorized', { error: e.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    };
  }
};

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header');
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header');
  }
  const jwtArr = authHeader.split(' ');
  const token = jwtArr[1];
  return token;
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  return verify(token, jwksUrl, { algorithms: ['RS256'] }) as JwtPayload;
}
