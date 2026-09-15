import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload, IAuthUser } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload): Promise<IAuthUser> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return {
      id: payload.sub,
      email: payload.email,
      rut: payload.rut,
      nombre: payload.nombre,
      apellido: payload.apellido,
    };
  }
}

