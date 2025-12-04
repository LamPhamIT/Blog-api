import { Request } from 'express';
import { TokenPayload } from "../utils/token.provider";

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}