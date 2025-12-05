import z from 'zod';
import { rawEnv } from '.'; 

const schema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string({ message: "CLOUDINARY_CLOUD_NAME is missing" }).min(1),
  CLOUDINARY_API_KEY: z.string({ message: "CLOUDINARY_API_KEY is missing" }).min(1),
  CLOUDINARY_API_SECRET: z.string({ message: "CLOUDINARY_API_SECRET is missing" }).min(1),
});

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

const parsed = schema.parse(rawEnv);

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: parsed.CLOUDINARY_CLOUD_NAME,
  apiKey: parsed.CLOUDINARY_API_KEY,
  apiSecret: parsed.CLOUDINARY_API_SECRET,
};