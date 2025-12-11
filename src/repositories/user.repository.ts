import { Prisma, User, UserRole, UserFollow } from '@prisma/client';
import { prisma } from '../prisma/client';
import { UpdateProfileDTO } from '../dtos/user.dto';

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

const userWithRolesAndCounts = Prisma.validator<Prisma.UserDefaultArgs>()({
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
        followers: true,
        following: true,
      },
    },
  },
});

export type UserWithRolesAndCounts = Prisma.UserGetPayload<
  typeof userWithRolesAndCounts
>;

const userWithFollowCounts = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    _count: {
      select: {
        followers: true,
        following: true,
      },
    },
  },
});

export type UserWithFollowCounts = Prisma.UserGetPayload<
  typeof userWithFollowCounts
>;

export class UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  create(
    data: { email: string; password: string; fullName?: string },
    tx: Prisma.TransactionClient = prisma,
  ): Promise<User> {
    return tx.user.create({ data });
  }

  assignRole(
    userId: string,
    roleId: number,
    tx: Prisma.TransactionClient = prisma,
  ): Promise<UserRole> {
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

  async findByIdWithRoles(id: string): Promise<UserWithRolesAndCounts | null> {
    return await prisma.user.findUnique({
      where: { id },
      ...userWithRolesAndCounts,
    });
  }

  async findById(id: string): Promise<UserWithFollowCounts | null> {
    return await prisma.user.findUnique({
      where: { id },
      ...userWithFollowCounts,
    });
  }

  async follow(followerId: string, followingId: string): Promise<UserFollow> {
    return await prisma.userFollow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  async unfollow(followerId: string, followingId: string): Promise<UserFollow> {
    return await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const count = await prisma.userFollow.count({
      where: {
        followerId,
        followingId,
      },
    });
    return count > 0;
  }

  async update(id: string, data: UpdateProfileDTO): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
      },
    });
  }
}
