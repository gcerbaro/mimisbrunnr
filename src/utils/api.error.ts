import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(
    code: string,
    message: string,
    statusCode: HttpStatus,
    metadata?: unknown,
  ) {
    super(
      {
        code,
        message,
        statusCode,
      },
      statusCode,
    );

    if (metadata) {
      Object.assign(this, { metadata });
    }
  }
}