import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginResponse } from 'src/dtos/login-response.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  async login(@Body() data: LoginDto): Promise<LoginResponse> {
    return this.authService.login(data.email, data.password);
  }
}
