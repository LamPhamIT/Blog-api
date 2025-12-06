import { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';

const userWithRolesAndPermissions = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    },
  },
});

export type UserWithPermissions = Prisma.UserGetPayload<
  typeof userWithRolesAndPermissions
>;

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  create(
    data: { email: string; password: string; fullName?: string },
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.create({ data });
  }

  assignRole(
    userId: string,
    roleId: number,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.userRole.create({
      data: { userId, roleId },
    });
  }

  findByEmailWithPermissions(
    email: string,
  ): Promise<UserWithPermissions | null> {
    return prisma.user.findUnique({
      where: { email },
      ...userWithRolesAndPermissions,
    });
  }

  async findByIdWithRoles(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            Post: true,
            Series: true,
          },
        },
      },
    });
  }
}
