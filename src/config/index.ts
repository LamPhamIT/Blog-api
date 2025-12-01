import dotenv from 'dotenv';
import path from 'path';

export const NODE_ENV = (process.env.NODE_ENV ?? 'development') as
  | 'development'
  | 'production'
  | 'test';

const envFile = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
dotenv.config({ path: envFile });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
export const rawEnv = process.env;
