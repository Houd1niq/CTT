import {BadRequestException, Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {PrismaService} from '../prisma/prisma.service';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import * as bcrypt from "bcryptjs";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {
  }

  async getAllUsers() {
    return this.userService.findAll();
  }

  async getAllRoles() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const {email, fullName, roleId, instituteId} = createEmployeeDto;

    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {email},
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await this.authService.hashData(tempPassword);

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email,
        hash: hashedPassword,
        RoleId: roleId,
        InstituteId: instituteId,
        fullName,
      },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        institute: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }
}
