import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/services/services.module';
import { CardController } from './card.controller';
import { LoginController } from './login.controller';
import { ProductController } from './product.controller';
import { UserController } from './user.contoller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ServicesModule
  ],
  controllers: [CardController, LoginController, ProductController, UserController],
})
export class ControllersModule {}
