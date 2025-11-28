import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  create(data: { email: string; password: string; fullName?: string }, tx: Prisma.TransactionClient = prisma  ) {
    return tx.user.create({ data });
  }

  assignRole(userId: string, roleId: number, tx: Prisma.TransactionClient = prisma) {
    return tx.userRole.create({
      data: { userId, roleId },
    });
  }
}
