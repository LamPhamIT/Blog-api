import dotenv from "dotenv";
import z from "zod";

const NODE_ENV = process.env.NODE_ENV ?? "test";
const isProduction = NODE_ENV === "production";

if(!isProduction) {
    const envFile = `.env.${NODE_ENV}`;
    dotenv.config({ path: envFile });
}


const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
})

export type EnvType = z.infer<typeof envSchema>;
export const env: EnvType = envSchema.parse(process.env);