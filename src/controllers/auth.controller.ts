import { Controller, Get } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getHello(): Promise<User> {
    return this.authService.getUserByToken("");
  }
}
