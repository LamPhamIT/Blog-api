import { TokenPayload } from '../utils/token.provider';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
