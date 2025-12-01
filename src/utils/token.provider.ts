import jwt, { Algorithm, SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export class TokenProvider {
  private readonly signingKey: string;
  private readonly verifyKey: string;
  private readonly algorithm: Algorithm;
  private readonly expiresIn: string | number;

  constructor(
    signingKey: string,
    verifyKey: string,
    algorithm: Algorithm,
    expiresIn: string | number,
  ) {
    this.signingKey = signingKey;
    this.verifyKey = verifyKey;
    this.algorithm = algorithm;
    this.expiresIn = expiresIn;
  }

  generate(payload: TokenPayload, options?: SignOptions): string {
    return jwt.sign(payload, this.signingKey, {
      ...options,
      expiresIn: this.expiresIn as SignOptions['expiresIn'],
      algorithm: this.algorithm,
    });
  }

  verify(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.verifyKey, {
        algorithms: [this.algorithm],
      }) as unknown as TokenPayload;
    } catch {
      return null;
    }
  }
}

export const accessTokenProvider = new TokenProvider(
  jwtConfig.JWT_PRIVATE_KEY_RSA,
  jwtConfig.JWT_PUBLIC_KEY_RSA,
  'RS256' as Algorithm,
  jwtConfig.JWT_ACCESS_EXPIRES_IN,
);

export const refreshTokenProvider = new TokenProvider(
  jwtConfig.JWT_REFRESH_SECRET,
  jwtConfig.JWT_REFRESH_SECRET,
  'HS256' as Algorithm,
  jwtConfig.JWT_REFRESH_EXPIRES_IN,
);
