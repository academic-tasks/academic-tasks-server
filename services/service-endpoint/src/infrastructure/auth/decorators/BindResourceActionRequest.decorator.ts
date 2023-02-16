import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ResourceActionRequest } from '../ResourceActionRequest';

export const BindResourceActionRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext().req;

    const resourceActionRequest =
      request.user ?? ResourceActionRequest.forPublicReadStrict();

    return resourceActionRequest;
  },
);
