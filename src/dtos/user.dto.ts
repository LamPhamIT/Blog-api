import { Permission, Role, RolePermission, User, UserRole } from "@prisma/client";

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
        permission: Permission
      })[]
    }
  })[];
  _count?: {
    Post: number;
    Series: number;
  }
};

export const mapToUserProfile = (user: UserWithRelations): UserProfileDto => {
  const roleNames = user.roles.map((ur) => ur.role.name);

  const allPermissions = user.roles.flatMap((ur) => 
    ur.role.permissions.map((rp) => rp.permission.name)
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
    stats: user._count ? {
      postsCount: user._count.Post,
      seriesCount: user._count.Series,
    } : undefined
  };
};