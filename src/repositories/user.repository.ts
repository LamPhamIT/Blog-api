import { prisma } from "../prisma/client";

export class UserRepository {
    findByEmail(email: string) {
        return prisma.user.findUnique({where: { email }});
    }

    create(data: { email: string; password: string; fullName?: string }) {
        return prisma.user.create({ data });
    }

    assignRole(userId: string, roleId: number) {
        return prisma.userRole.create({
            data: { userId, roleId }
        })
    }
}