import z from 'zod';

import { rawEnv } from '.';

const schema = z.object({
  DATABASE_URL: z.url(),
});

export type DatabaseConfig = z.infer<typeof schema>;
const parsed = schema.parse(rawEnv);

export const databaseConfig: DatabaseConfig = {
  DATABASE_URL: parsed.DATABASE_URL,
};
