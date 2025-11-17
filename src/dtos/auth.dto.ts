import z from "zod";

export const RegisterSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    fullName: z.string().optional(),
})

export type RegisterDTO = z.infer<typeof RegisterSchema>;