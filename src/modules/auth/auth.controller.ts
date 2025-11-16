// import {
//   Body,
//   Controller,
//   Post,
//   Get,
//   BadRequestException,
//   Logger,
// } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiTags,
//   ApiResponse,
// } from '@nestjs/swagger';
// import { Public } from './decorators/public.decorator';
// import { CurrentUser } from './decorators/current-user.decorator';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';

// import { AuthService } from './auth.service';
// import { UsersService } from './users.service';
// import { IdentityLoginDto } from './dto/identity-login.dto';
// import { RefreshDto } from './dto/refresh.dto';
// import { LogoutDto } from './dto/logout.dto';

// @ApiTags('auth')
// @Controller('auth')
// export class AuthController {
//   private readonly logger = new Logger(AuthController.name);

//   constructor(
//     private readonly auth: AuthService,
//     private readonly users: UsersService,
//   ) {}

//   @Public()
//   @Post('jwt-login')
//   async jwtLogin(@Body() body: IdentityLoginDto) {
//     const { identityToken } = body;
//     if (!identityToken)
//       throw new BadRequestException('identityToken is required');

//     return this.auth.jwtLogin(body);
//   }

//   @Public()
//   @Post('refresh')
//   async refresh(@Body() body: RefreshDto) {
//     return this.auth.refresh(body);
//   }

//   @Get('me')
//   getMe(@CurrentUser() user: { userId: string }) {
//     return this.users.findById(user.userId);
//   }

//   /**
//    * Revoke refresh tokens for the authenticated user.
//    * Default: revoke all devices.
//    */
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Logout and revoke refresh tokens' })
//   @ApiResponse({
//     status: 201,
//     description: 'Successfully revoked refresh tokens',
//     schema: {
//       type: 'object',
//       properties: {
//         success: { type: 'boolean', example: true },
//         revoked: { type: 'string', enum: ['all', 'single'], example: 'all' },
//         count: { type: 'number', example: 2 },
//       },
//     },
//   })
//   @Post('logout')
//   async logout(
//     @CurrentUser() user: { userId: string },
//     @Body() dto: LogoutDto,
//   ) {
//     const refreshToken = dto.allDevices === false ? undefined : undefined; // Could be extracted from headers if needed
//     return this.auth.logout(user.userId, dto.allDevices, refreshToken);
//   }
// }
