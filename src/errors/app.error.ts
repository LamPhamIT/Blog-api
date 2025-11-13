import { ErrorDetail } from '../utils/response.factory';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly messageKey: string;
  public readonly details?: ErrorDetail[];
  public readonly args?: (string | number)[];

  constructor(
    statusCode: number,
    messageKey: string,
    details?: ErrorDetail | ErrorDetail[],
    ...args: (string | number)[]
  ) {
    super(messageKey);
    this.statusCode = statusCode;
    this.messageKey = messageKey;
    this.details = details
      ? Array.isArray(details)
        ? details
        : [details]
      : undefined;
    this.args = args;
  }
}
