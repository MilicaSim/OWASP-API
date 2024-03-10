import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ServicesModule } from 'src/services/services.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EntitiesModule } from 'src/entities/entities.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Module({
  imports: [
    ServicesModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn'),
            algorithm: 'HS256'
          }
        };
      },
      inject: [ConfigService]
    }),
    EntitiesModule
  ],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtModule, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}