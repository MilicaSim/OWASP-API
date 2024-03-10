import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.contoller';
import { ProductController } from './controllers/product.controller';
import { CardController } from './controllers/card.controller';
import { APP_GUARD, RouterModule, Routes } from '@nestjs/core';
import { PermissionGuard } from './auth/guards/permission.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoginController } from './controllers/login.controller';
import { ControllersModule } from './controllers/controllers.module';
import * as path from 'path';

// config
import dbConfig from './config/db.config';
import authConfig from './config/auth.config'
import { ServeStaticModule } from '@nestjs/serve-static';
import { TokenGuard } from './auth/guards/token.guard';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';

const routes: Routes = [
  {
    path: '/api/v1',
    module: ControllersModule
  }
]
@Module({
  imports: [
    ControllersModule,
    AuthModule,
    ServicesModule,
    RouterModule.register(routes),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [dbConfig, authConfig],
    }),
    ServeStaticModule.forRoot({
      serveStaticOptions: {
        fallthrough: false,
        index: false
      },
      rootPath: require.main.path + path.sep + 'public',
      exclude: ['/api/*'],
    }),
    ThrottlerModule.forRoot([{ // This module protects app from brute-force attak
      ttl: 60000,
      limit: 10,
    }])
  ],
  controllers: [LoginController, UserController, ProductController, CardController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: TokenGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
]
})
export class AppModule {}
