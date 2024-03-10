import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/decorators/is-public.decorator";
import { User } from "src/entities/user.entity";
import { AuthService } from "../auth.service";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor (
    private authService: AuthService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<string>(
      IS_PUBLIC_KEY,
      context.getHandler()
    );

    // public endpoint
    if (isPublic)
      return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = <string>request.headers['api-token'];
    
    let user: User;
    // if (token)
      // user = await this.authService.getUserByToken(token);

    if (!user)
      throw new UnauthorizedException();
    
    request.user = user;
    return true;
  }
}