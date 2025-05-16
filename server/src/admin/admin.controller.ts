import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('roles')
  async getAllRoles() {
    return this.adminService.getAllRoles();
  }

  @Post('users')
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.adminService.createEmployee(createEmployeeDto);
  }
} 