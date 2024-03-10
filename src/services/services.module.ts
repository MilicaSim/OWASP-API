import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import { CardService } from './card.service';
import { ProductService } from './product.service';
import { Card } from 'src/entities/card.entity';
import { Product } from 'src/entities/product.entity';
import { EntitiesModule } from 'src/entities/entities.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    EntitiesModule,
    HttpModule,
    TypeOrmModule.forFeature([
        UserRole,
        User,
        Card,
        Product
    ])
  ],
  providers: [UserService, CardService, ProductService],
  exports: [UserService, CardService, ProductService],
})
export class ServicesModule {}