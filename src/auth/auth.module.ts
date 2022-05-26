import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@/users/user.module';

import { Algorithm } from './../../node_modules/@types/jsonwebtoken/index.d';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: '3600s',
          algorithm: config.get<Algorithm>('auth.jwt.alg'),
          issuer: config.get<string>('auth.jwt.issuer'),
        },
        verifyOptions: {
          algorithms: [config.get<Algorithm>('auth.jwt.alg')],
          issuer: config.get<string>('auth.jwt.issuer'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
