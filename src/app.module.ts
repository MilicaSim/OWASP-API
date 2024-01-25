import { Module } from '@nestjs/common';
import db from './config/db.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Card } from './entities/card.entity';
import { Product } from './entities/product.entity';
import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { CardService } from './services/card.service';
import { UserController } from './controllers/user.contoller';
import { ProductController } from './controllers/product.controller';
import { CardController } from './controllers/card.controller';
import { TokenGuard } from './auth/guards/token.guard';
import { APP_GUARD } from '@nestjs/core';
// import { PermissionGuard } from './auth/guards/permission.guard';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthToken } from './entities/auth-token.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [db],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      // entities: [ Card, Product, AuthToken, User, UserRole],
      entities: [Product],
      synchronize: false,
      keepConnectionAlive: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      logging: false,
      poolSize: 20
    }),
  ],
  controllers: [UserController, ProductController, CardController, AuthController],
  providers: [
  // {
  //   provide: APP_GUARD,
  //   useClass: TokenGuard
  // },
  // {
  //   provide: APP_GUARD,
  //   useClass: PermissionGuard
  // },
  // {
  //   provide: APP_GUARD,
  //   useClass: ThrottlerGuard
  // },
  UserService, ProductService, CardService, AuthService
]
})
export class AppModule {}
