// import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { randomBytes } from 'crypto';

// import { PrismaService } from '../../services/prisma.service';
// import { UsersService } from './users.service';
// import { IdentityLoginDto } from './dto/identity-login.dto';
// import { RefreshDto } from './dto/refresh.dto';
// import {
//   INVALID_ACCESS_TOKEN,
//   INVALID_REFRESH_TOKEN,
// } from '@constants/errors.constants';

// @Injectable()
// export class AuthService {
//   private readonly logger = new Logger(AuthService.name);

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly jwt: JwtService,
//     private readonly users: UsersService,
//     private readonly config: ConfigService,
//   ) {}

//   private async signAccess(userId: string) {
//     const payload = { sub: userId };
//     const jwtConfig = this.config.get('jwt');
//     return this.jwt.signAsync(payload, {
//       secret: jwtConfig.secret,
//       expiresIn: jwtConfig.expiresIn,
//     });
//   }

//   private async mintRefreshToken(userId: string) {
//     // Generate opaque random token stored server-side (recommended approach)
//     const token = randomBytes(48).toString('hex');
//     const ttlString = this.config.get<string>('jwt.refreshExpiresIn') ?? '30d';

//     // Simple parsing for common time formats
//     let days = 30; // default
//     if (ttlString.endsWith('d')) {
//       days = parseInt(ttlString.replace('d', ''), 10);
//     }

//     const expiresAt = new Date();
//     expiresAt.setDate(expiresAt.getDate() + days);

//     // Store in TokenWhiteList table
//     const tokenRecord = await this.prisma.tokenWhiteList.create({
//       data: {
//         userId,
//         refreshToken: token,
//         expiredAt: expiresAt,
//         // Note: revoked field will be available after migration
//       },
//     });

//     return { token, expiresAt, tokenId: tokenRecord.id };
//   }

//   async jwtLogin(dto: IdentityLoginDto) {
//     const { identityToken } = dto;

//     const user = await this.users.findById(identityToken);

//     const accessToken = await this.signAccess(user.id);
//     const { token: refreshToken } = await this.mintRefreshToken(user.id);

//     return {
//       accessToken,
//       refreshToken,
//       expiresIn: this.config.get<string>('jwt.expiresIn') ?? '15m',
//       user,
//     };
//   }

//   async refresh(dto: RefreshDto) {
//     // Find by refreshToken and ensure it's not revoked
//     const found = await this.prisma.tokenWhiteList.findFirst({
//       where: {
//         refreshToken: dto.refreshToken,
//         expiredAt: { gt: new Date() },
//         revoked: false, // Ensure the token is not revoked
//       },
//     });

//     if (!found) {
//       throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
//     }

//     // Get user separately
//     const user = await this.prisma.user.findUnique({
//       where: { id: found.userId },
//       select: {
//         id: true,
//         email: true,
//         roles: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }

//     // Rotate refresh token (recommended security practice)
//     // For now, just delete the old token until revoked field is available
//     await this.prisma.tokenWhiteList.delete({
//       where: { id: found.id },
//     });

//     const accessToken = await this.signAccess(found.userId);
//     const { token: refreshToken } = await this.mintRefreshToken(found.userId);

//     return {
//       accessToken,
//       refreshToken,
//       expiresIn: this.config.get<string>('jwt.expiresIn') ?? '15m',
//       user,
//     };
//   }

//   async logout(userId: string, allDevices = true, refreshToken?: string) {
//     if (allDevices) {
//       // Revoke all non-revoked refresh tokens for this user
//       const updateResult = await this.prisma.tokenWhiteList.updateMany({
//         where: {
//           userId,
//           revoked: false,
//           expiredAt: { gt: new Date() }, // Only revoke non-expired tokens
//         },
//         data: {
//           revoked: true,
//           updatedAt: new Date(),
//         },
//       });

//       this.logger.debug(
//         `Revoked ${updateResult.count} refresh tokens for user ${userId}`,
//       );
//       return { success: true, revoked: 'all', count: updateResult.count };
//     }

//     if (!refreshToken) {
//       return {
//         success: false,
//         message: 'refreshToken required when allDevices = false',
//       };
//     }

//     // Revoke specific refresh token
//     const updateResult = await this.prisma.tokenWhiteList.updateMany({
//       where: {
//         userId,
//         refreshToken,
//         revoked: false,
//         expiredAt: { gt: new Date() },
//       },
//       data: {
//         revoked: true,
//         updatedAt: new Date(),
//       },
//     });

//     this.logger.debug(
//       `Revoked ${updateResult.count} refresh token for user ${userId}`,
//     );
//     return {
//       success: true,
//       revoked: 'single',
//       count: updateResult.count,
//     };
//   }
// }
