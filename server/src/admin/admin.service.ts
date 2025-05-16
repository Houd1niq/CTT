import {BadRequestException, Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {PrismaService} from '../prisma/prisma.service';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {AuthService} from "../auth/auth.service";
import {EditEmployeeDto} from "./dto/edit-employee.dto";
import {EmailService} from "../email/email.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService
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

  async createEmployee(createEmployeeDto: CreateEmployeeDto, origin: string) {
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

    try {
      await this.emailService.sendRegisterNotification(email, origin)
    } catch (e) {
      console.log(e)
    }
    
    return user;
  }

  async deleteEmployee(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {id},
      include: {role: true}
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.role.name === 'admin') {
      throw new BadRequestException('Cannot delete admin user');
    }

    await this.prisma.user.delete({
      where: {id}
    });

    return {message: 'User deleted successfully'};
  }

  async editEmployee(id: number, editEmployeeDto: EditEmployeeDto) {
    const {email, fullName, roleId, instituteId} = editEmployeeDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: {id},
      include: {role: true}
    });

    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    // If trying to change email, check if new email is not taken
    if (email && email !== existingUser.email) {
      const userWithEmail = await this.prisma.user.findUnique({
        where: {email}
      });

      if (userWithEmail) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: {id},
      data: {
        ...(email && {email}),
        ...(fullName && {fullName}),
        ...(roleId && {RoleId: roleId}),
        ...(instituteId && {InstituteId: instituteId}),
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

    return updatedUser;
  }
}
