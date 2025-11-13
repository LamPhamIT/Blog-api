import z from 'zod';

import { rawEnv } from '.';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
});

export type SystemConfig = z.infer<typeof schema>;
const parsed = schema.parse(rawEnv);

export const systemConfig: SystemConfig = {
  NODE_ENV: parsed.NODE_ENV,
  PORT: parsed.PORT,
};
