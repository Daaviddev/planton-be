import { type ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    // Access the refreshToken from the parsed cookies
    return request.cookies?.refreshToken || null;
  },
);
