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

  async follow(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        UserKeys.USER_CANNOT_FOLLOW_SELF,
      );
    }

    const targetUser = await userRepository.findById(targetUserId);

    if (!targetUser) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        UserKeys.USER_NOT_FOUND,
        ErrorDetails.USER_NOT_FOUND,
      );
    }

    const isFollowing = await userRepository.isFollowing(
      followerId,
      targetUserId,
    );

    if (isFollowing) {
      return false;
    }

    await userRepository.follow(followerId, targetUserId);
    return true;
  }

  async unfollow(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        UserKeys.USER_CANNOT_UNFOLLOW_SELF,
      );
    }

    const isFollowing = await userRepository.isFollowing(
      followerId,
      targetUserId,
    );

    if (!isFollowing) {
      return false;
    }

    await userRepository.unfollow(followerId, targetUserId);
    return true;
  }
}

export default new UserService();