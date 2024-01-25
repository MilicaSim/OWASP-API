import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "src/decorators/permissions.decorator";
import { Permission } from "src/enums/permission.enum";
import { Request } from "src/http/request";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor (
      private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // public endpoint
    if (!user)
      return true;

    // no permissions set
    if (!requiredPermissions || !requiredPermissions.length)
      return true;

    for (const p of requiredPermissions) {
      const hasPermission = await user.hasPermission(p);
      if (hasPermission)
        return true;
    }

    return false;
  }
}