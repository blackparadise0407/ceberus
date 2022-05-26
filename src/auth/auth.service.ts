import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(private readonly jwtService: JwtService) {
    this.logger = new Logger('AuthService');
  }

  public async verify(jwt: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync<JwtPayload>(jwt);
  }

  public async sign(payload: JwtPayload): Promise<string | undefined> {
    try {
      return await this.jwtService.signAsync(payload);
    } catch (e) {
      this.logger.error(e?.message);
    }
  }

  public async stringHash(str: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(str, salt);
  }

  public async compareHash(str: string, hash: string): Promise<boolean> {
    return await bcryptjs.compare(str, hash);
  }
}
