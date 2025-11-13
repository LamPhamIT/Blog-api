import messageResolver from './message.resolver';

export interface ErrorDetail {
  code: string;
  detail: string;
  field?: string;
}

export interface SuccessResponse<T> {
  success: true;
  messageKey: string;
  message: string | null;
  data: T;
}

export interface ErrorResponse {
  success: false;
  messageKey: string;
  message: string | null;
  errors?: ErrorDetail[];
}

export const successResponse = <T>(
  messageKey: string,
  data: T,
  ...args: (string | number)[]
): SuccessResponse<T> => ({
  success: true,
  messageKey,
  message: messageResolver(messageKey, ...args),
  data,
});

export const errorResponse = (
  messageKey: string,
  errors: ErrorDetail[] | ErrorDetail,
  ...args: (string | number)[]
): ErrorResponse => ({
  success: false,
  messageKey,
  message: messageResolver(messageKey, ...args),
  errors: Array.isArray(errors) ? errors : [errors],
});
