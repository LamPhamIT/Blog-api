import { StatusCodes } from 'http-status-codes';
import { RegisterDTO } from '../dtos/auth.dto';
import { AppError } from '../errors/app.error';
import { RoleRepository } from '../repositories/role.repository';
import { UserRepository } from '../repositories/user.repository';
import { RoleKeys, UserKeys } from '../constants/message-key';
import { ErrorDetails } from '../constants/error-detail.constant';
import { BCRYPT } from '../constants/hash.constant';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

class AuthService {
  async register(data: RegisterDTO) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(
        StatusCodes.CONFLICT,
        UserKeys.USER_EMAIL_EXISTS,
        ErrorDetails.USER_EMAIL_EXISTS,
      );
    }
    const hashed = await bcrypt.hash(data.password, BCRYPT.SALT_ROUNDS);

    const defaultRole = await roleRepository.findByName('USER');
    if (!defaultRole) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        RoleKeys.ROLE_MISSING,
        ErrorDetails.ROLE_MISSING,
      );
    }

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await userRepository.create(
        { ...data, password: hashed },
        tx,
      );

      await userRepository.assignRole(newUser.id, defaultRole.id, tx);

      return newUser;
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
    };
  }
}

export default new AuthService();
