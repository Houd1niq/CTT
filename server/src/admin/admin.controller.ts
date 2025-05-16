import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {AdminService} from './admin.service';
import {AuthGuard} from '@nestjs/passport';
import {AdminGuard} from '../auth/guards/admin.guard';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {EditEmployeeDto} from './dto/edit-employee.dto';
import {Request} from 'express';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('roles')
  async getAllRoles() {
    return this.adminService.getAllRoles();
  }

  @Post('users')
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req: Request) {
    // console.log(req.headers.origin)
    return this.adminService.createEmployee(createEmployeeDto, req.headers.origin);
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
