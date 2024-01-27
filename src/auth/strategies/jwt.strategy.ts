import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from "src/entities/user.entity";
import { AuthService } from "src/services/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'd6a47cb9290980515daee4be1954989e7d65da451603838079fcccb67e3dcdc6',
        algorithms: ['HS256']
    });
  }

  async validate(payload: any): Promise<User> {
    return this.authService.getUserById(payload.sub);
  }
}