import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const errorResponse = exception.getResponse() as any;

    const aditionalErrorInfo = {
      ...(exception.getStatus() === 422 ? errorResponse : {}),
    };

    if (host.getType() === 'http') {
      // do something that is only important in the context of regular HTTP requests (REST)

      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      const status = exception.getStatus();
      const message = exception.message || 'Internal server error';

      const errorResponse = {
        message,

        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,

        ...aditionalErrorInfo,
      };

      response.status(status).json(errorResponse);
    } else if (host.getType() === 'rpc') {
      // do something that is only important in the context of Microservice requests
    } else if (host.getType<GqlContextType>() === 'graphql') {
      // do something that is only important in the context of GraphQL requests

      // const gqlHost = GqlArgumentsHost.create(host);

      return exception;
    }
  }
}
