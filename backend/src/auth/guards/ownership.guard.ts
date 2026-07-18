import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceOwnerId = request.resourceOwnerId;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin can access any resource
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Check if user owns the resource
    if (resourceOwnerId && user.id !== resourceOwnerId.toString()) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
