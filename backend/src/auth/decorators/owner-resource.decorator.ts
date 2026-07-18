import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const OwnerResource = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.resourceOwnerId;
  },
);
