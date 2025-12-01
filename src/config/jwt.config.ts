import path from 'path';
import { rawEnv } from '.';
import z from 'zod';
import fs from 'fs';

const KEY_PATH = 'config/keys';

const formatKey = (key?: string) => key?.replace(/\\n/g, '\n');

const readKeyFromFile = (fileName: string): string | undefined => {
  try {
    const filePath = path.join(process.cwd(), KEY_PATH, fileName);
    return fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf8')
      : undefined;
  } catch {
    return undefined;
  }
};

const JwtConfigSchema = z.object({
  JWT_PRIVATE_KEY_RSA: z.string({ message: 'Missing RSA private key' }).min(50),
  JWT_PUBLIC_KEY_RSA: z.string({ message: 'Missing RSA public key' }).min(50),

  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),

  JWT_REFRESH_SECRET: z
    .string({ message: 'Missing refresh token secret' })
    .min(32),

  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const parsedConfig = JwtConfigSchema.parse({
  JWT_PRIVATE_KEY_RSA:
    formatKey(rawEnv.JWT_PRIVATE_KEY_RSA) ?? readKeyFromFile('rsa.key'),
  JWT_PUBLIC_KEY_RSA:
    formatKey(rawEnv.JWT_PUBLIC_KEY_RSA) ?? readKeyFromFile('rsa.pub'),

  JWT_ACCESS_EXPIRES_IN: rawEnv.JWT_ACCESS_EXPIRES_IN,

  JWT_REFRESH_SECRET: rawEnv.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: rawEnv.JWT_REFRESH_EXPIRES_IN,
});

export const jwtConfig = parsedConfig;
