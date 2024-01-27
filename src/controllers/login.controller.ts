import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Public } from 'src/decorators/is-public.decorator';
import { LoginResponse } from 'src/dtos/login-response.dto';
import { Request } from 'src/http/request';
import { AuthService } from 'src/services/auth.service';

@Controller('login')
export class LoginController {

  constructor(
    private authService: AuthService
  ) {}

  @Post()
  @Public()
  @UseGuards(LocalAuthGuard)
  async login( @Req() req: Request): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }
}
