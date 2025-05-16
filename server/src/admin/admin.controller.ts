import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EditEmployeeDto } from './dto/edit-employee.dto';

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

  @Put('users/:id')
  async editEmployee(
    @Param('id') id: string,
    @Body() editEmployeeDto: EditEmployeeDto
  ) {
    return this.adminService.editEmployee(parseInt(id), editEmployeeDto);
  }

  @Delete('users/:id')
  async deleteEmployee(@Param('id') id: string) {
    return this.adminService.deleteEmployee(parseInt(id));
  }
} 