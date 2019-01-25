import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UnauthorizedError } from 'express-jwt';

@Catch(UnauthorizedError)
export class UnauthorizedErrorFilter implements ExceptionFilter {
  catch(exception: UnauthorizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.status;

    console.log('exception.message: ', exception.message);

    response
      .status(status)
      .json({
        statusCode: status,
        error: exception.code,
        message: exception.message,
      });
  }
}
