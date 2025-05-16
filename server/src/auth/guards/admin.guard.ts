import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userWithRole = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true }
    });

    if (!userWithRole || userWithRole.role.name !== 'admin') {
      throw new UnauthorizedException('User does not have admin privileges');
    }

    return true;
  }
} 