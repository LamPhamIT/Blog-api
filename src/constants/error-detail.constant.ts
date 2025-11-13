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
};

export type ErrorDetailKey = keyof typeof ErrorDetails;
export type ErrorDetailValue = (typeof ErrorDetails)[ErrorDetailKey];
