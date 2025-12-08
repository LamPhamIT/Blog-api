import { ErrorDetail } from '../utils/response.factory';

export const ErrorDetails: Record<string, ErrorDetail> = {
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    detail: 'An unexpected error occurred on the server.',
  },
  VALIDATION_FAILED: {
    code: 'VALIDATION_FAILED',
    detail: 'Request validation failed.',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    detail: 'User not found.',
  },
  FORBIDDEN_ACCESS: {
    code: 'FORBIDDEN_ACCESS',
    detail: 'You do not have permission to perform this action.',
  },
  USER_EMAIL_EXISTS: {
    code: 'USER_EMAIL_EXISTS',
    detail: 'The provided email is already in use.',
  },
  ROLE_MISSING: {
    code: 'ROLE_MISSING',
    detail: 'A required role is missing for this operation.',
  },
  INVALID_CREDENTIAL: {
    code: 'INVALID_CREDENTIAL',
    detail: 'The provided credentials are invalid.',
  },
  TOKEN_MISSING: {
    code: 'TOKEN_MISSING',
    detail: 'Authentication token is missing or malformed.',
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    detail: 'Authentication token is invalid or expired.',
  },
  SERIES_NOT_FOUND: {
    code: 'SERIES_NOT_FOUND',
    detail: 'The specified series was not found.',
  },
  TAGS_LIMIT_EXCEEDED: {
    code: 'TAGS_LIMIT_EXCEEDED',
    detail:
      'You have exceeded the maximum number of tags allowed per post (Max {0}).',
  },
  FILE_TOO_LARGE: {
    code: 'FILE_TOO_LARGE',
    detail: 'The uploaded file exceeds the maximum allowed size.',
  },
  UNSUPPORTED_FILE_TYPE: {
    code: 'UNSUPPORTED_FILE_TYPE',
    detail: 'The uploaded file type is not supported.',
  },
  NO_FILE_UPLOADED: {
    code: 'NO_FILE_UPLOADED',
    detail: 'No file uploaded. Please provide a file in the request.',
  },
  POST_NOT_FOUND: {
    code: 'POST_NOT_FOUND',
    detail: 'The specified post was not found.',
  },
  COMMENT_NOT_FOUND: {
    code: 'COMMENT_NOT_FOUND',
    detail: 'The specified comment was not found.',
  },
  INVALID_PARENT: {
    code: 'INVALID_PARENT',
    detail: 'The specified parent comment is invalid for this post.',
  },
};

export type ErrorDetailKey = keyof typeof ErrorDetails;
export type ErrorDetailValue = (typeof ErrorDetails)[ErrorDetailKey];
