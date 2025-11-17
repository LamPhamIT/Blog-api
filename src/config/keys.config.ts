import path from "path";
import { rawEnv } from ".";
import z from "zod";
import fs from "fs";

const RsaKeySchema = z.object(
    {
        JWT_PRIVATE_KEY: z.string().optional(),
        JWT_PUBLIC_KEY: z.string().optional()
    }
)

const KEY_DIR = path.resolve(__dirname, '../../config/keys');

const PRIVATE_KEY_PATH = path.join(KEY_DIR, 'rsa.key');
const PUBLIC_KEY_PATH = path.join(KEY_DIR, 'rsa.pub');

const parsedEnv = RsaKeySchema.parse(rawEnv);

let publicKey: string | undefined = parsedEnv.JWT_PUBLIC_KEY;
let privateKey: string | undefined = parsedEnv.JWT_PRIVATE_KEY;

if(!privateKey || !publicKey) {
    try {
        if(fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
            privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
            publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8');
        }
    } catch (_error) {
        privateKey = undefined;
        publicKey = undefined;
    }
}

const finalRsaKeySchema = z.object({
     JWT_PRIVATE_KEY_RSA: z.string().min(1, "Private key must not be empty"),
     JWT_PUBLIC_KEY_RSA: z.string().min(1, "Public key must not be empty"),
})


const finalParsed = finalRsaKeySchema.parse({
    JWT_PRIVATE_KEY_RSA: privateKey,
    JWT_PUBLIC_KEY_RSA: publicKey
});

export type KeysConfig = z.infer<typeof finalRsaKeySchema>;

export const keysConfig: KeysConfig = {
    JWT_PRIVATE_KEY_RSA: finalParsed.JWT_PRIVATE_KEY_RSA,
    JWT_PUBLIC_KEY_RSA: finalParsed.JWT_PUBLIC_KEY_RSA
}
