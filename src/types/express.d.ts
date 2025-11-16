import { type ExecutionContext, createParamDecorator } from '@nestjs/common';

// Extend Express Request to include user property for auth
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        [key: string]: any;
      };
    }
  }
}

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
