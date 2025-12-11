import {
  Permission,
  Role,
  RolePermission,
  User,
  UserRole,
} from '@prisma/client';
import z from 'zod';

export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  stats?: {
    postsCount: number;
    seriesCount: number;
  };
}

type UserWithRelations = User & {
  roles: (UserRole & {
    role: Role & {
      permissions: (RolePermission & {
        permission: Permission;
      })[];
    };
  })[];
  _count?: {
    Post: number;
    Series: number;
  };
};

export const mapToUserProfile = (user: UserWithRelations): UserProfileDto => {
  const roleNames = user.roles.map((ur) => ur.role.name);

  const allPermissions = user.roles.flatMap((ur) =>
    ur.role.permissions.map((rp) => rp.permission.name),
  );
  const uniquePermissions = [...new Set(allPermissions)];

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    roles: roleNames,
    permissions: uniquePermissions,
    createdAt: user.createdAt,
    stats: user._count
      ? {
          postsCount: user._count.Post,
          seriesCount: user._count.Series,
        }
      : undefined,
  };
};

export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .optional(),
  avatarUrl: z.url('Avatar must be a valid URL').optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;
