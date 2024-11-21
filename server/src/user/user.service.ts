import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }

  async getUserInfo(email: string) {
    const user = this.prisma.admin.findUnique({
      where: {
        email
      },
      select: {
        email: true,
        id: true
      }
    })

    if (!user) {
      throw new BadRequestException()
    }

    return user
  }
}
