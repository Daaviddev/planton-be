// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { UsersService } from './users.service';
// import { JwtStrategy } from './jwt.strategy';
// import { PrismaService } from '../../services/prisma.service';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { GlobalJwtAuthGuard } from './guards/global-jwt.guard';

// @Module({
//   imports: [
//     ConfigModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: (cfg: ConfigService) => {
//         const jwtConfig = cfg.get('jwt');
//         return {
//           secret: jwtConfig.secret,
//           signOptions: { expiresIn: jwtConfig.expiresIn },
//         };
//       },
//       inject: [ConfigService],
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     UsersService,
//     JwtStrategy,
//     JwtAuthGuard,
//     {
//       provide: APP_GUARD,
//       useClass: GlobalJwtAuthGuard,
//     },
//     PrismaService,
//   ],
//   exports: [UsersService, JwtAuthGuard],
// })
// export class AuthModule {}
