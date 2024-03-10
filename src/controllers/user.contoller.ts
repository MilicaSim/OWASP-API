import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/decorators/is-public.decorator';
import { LoginSuccessDto } from 'src/dtos/auth/login-success.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { UserService } from 'src/services/user.service';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post()
  @Public()
  @UseGuards(ThrottlerGuard)
  async login(@Body() data: LoginDto): Promise<LoginSuccessDto> {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    console.log(hash);
    return this.authService.loginUser(data.email, data.password);
  }

  @Post('register')
  @Public()
  async register(@Body() data: RegisterDto): Promise<void> {
    return this.userService.register(data);
  }
}
