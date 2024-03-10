import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
// import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Public } from 'src/decorators/is-public.decorator';
import { LoginSuccessDto } from 'src/dtos/auth/login-success.dto';
import { Request } from 'src/http/request';

@Controller('login')
export class LoginController {

  constructor(
    private authService: AuthService
  ) {}

  @Post()
  @Public()
  // @UseGuards(LocalAuthGuard)
  async login( @Req() req: Request): Promise<LoginSuccessDto> {
    return this.authService.login(req.user);
  }
}
