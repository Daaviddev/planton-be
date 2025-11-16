// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { JwtPayload } from './jwt.types';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: config.getOrThrow<string>('jwt.secret'),
//     });
//   }

//   async validate(payload: JwtPayload) {
//     // What you return here becomes request.user
//     return;
//   }
// }
