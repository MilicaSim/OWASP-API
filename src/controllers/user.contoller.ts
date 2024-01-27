import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginResponse } from 'src/dtos/login-response.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  async login(@Body() data: LoginDto): Promise<LoginResponse> {
    return this.authService.loginUser(data.email, data.password);
  }

  @Post('register')
  async register(@Body() data: RegisterDto): Promise<void> {
    return this.userService.register(data);
  }
}
