import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Algorithm } from './../../../node_modules/@types/jsonwebtoken/index.d';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('auth.jwt.secret'),
      algorithms: [config.get<Algorithm>('auth.jwt.alg')],
      issuer: config.get<string>('auth.jwt.issuer'),
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
