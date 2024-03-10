import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import { Card } from 'src/entities/card.entity';
import { Product } from 'src/entities/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthToken } from './auth-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            return {
                type: 'postgres',
                host: configService.get<string>('db.host'),
                port: configService.get<number>('db.port'),
                username: configService.get<string>('db.username'),
                password: configService.get<string>('db.password'),
                database: configService.get<string>('db.database'),
                synchronize: false,
                keepConnectionAlive: true,
                autoLoadEntities: true,
                namingStrategy: new SnakeNamingStrategy(),
                // logging: true,
                poolSize: 20
            }
        },
        inject: [ConfigService]
    })
  ],
  providers: [User, UserRole, AuthToken, Card, Product],
  exports: [User, UserRole, AuthToken, Card, Product],
})
export class EntitiesModule {}