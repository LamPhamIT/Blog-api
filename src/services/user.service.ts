import { StatusCodes } from 'http-status-codes';
import { UserKeys } from '../constants/message-key';
import { ErrorDetails } from '../constants/error-detail.constant';
import { AppError } from '../errors/app.error';
import { mapToUserProfile, UserProfileDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();
class UserService {
  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await userRepository.findByIdWithRoles(userId);

    if (!user) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        UserKeys.USER_NOT_FOUND,
        ErrorDetails.USER_NOT_FOUND,
      );
    }

    return mapToUserProfile(user);
  }
}

export default new UserService();
