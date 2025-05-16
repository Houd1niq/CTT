import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';

@Injectable()
export class EditPatentAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const patentId = request.params.patentId as string;
    const patentNumber = request.params.patentNumber as string;

    const payloadInstituteId = request.body.instituteId ? Number(request.body.instituteId) : null;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user with role
    const userWithRole = await this.prisma.user.findUnique({
      where: {id: user.id},
      include: {role: true}
    });

    if (!userWithRole) {
      throw new ForbiddenException('User not found');
    }

    // Admin has full access
    if (userWithRole.role.name === 'admin') {
      return true;
    }

    let patent: { InstituteId: number };

    if (patentId) {
      patent = await this.prisma.patent.findUnique({
        where: {id: parseInt(patentId)},
        select: {InstituteId: true}
      });
    } else if (patentNumber) {
      patent = await this.prisma.patent.findUnique({
        where: {patentNumber},
        select: {InstituteId: true}
      });
    }

    // For other roles, check if they belong to the same institute as the patent
    if (!patent) {
      throw new ForbiddenException('Patent not found');
    }

    if (payloadInstituteId !== null) {
      if (userWithRole.InstituteId !== payloadInstituteId
        || userWithRole.InstituteId !== patent.InstituteId
        || patent.InstituteId !== payloadInstituteId
      ) {
        throw new ForbiddenException('You do not have access to this patent');
      }
    }

    if (userWithRole.InstituteId !== patent.InstituteId) {
      throw new ForbiddenException('You do not have access to this patent');
    }

    return true;
  }
}
