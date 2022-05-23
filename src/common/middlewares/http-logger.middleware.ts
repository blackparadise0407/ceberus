import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    // const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      this.logger.log(`${method} ${originalUrl} [${statusCode}]`);
    });

    next();
  }
}
