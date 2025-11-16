import { Controller, Get } from '@nestjs/common';
import {
  CurrentUser,
  JwtUser,
} from '../auth/decorators/current-user.decorator';

@Controller({
  path: '',
  version: '1',
})
export class ProtectedController {
  @Get('protected')
  getProtected(@CurrentUser() user: JwtUser) {
    return { message: 'You are authenticated!', user };
  }
}
