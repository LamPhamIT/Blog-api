import { prisma } from '../prisma/client';

export class RoleRepository {
  findByName(name: string) {
    return prisma.role.findUnique({ where: { name } });
  }
}
