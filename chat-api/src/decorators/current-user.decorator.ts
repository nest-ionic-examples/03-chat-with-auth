import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user);
