import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class EditEmployeeDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  roleId?: number;

  @IsInt()
  @IsOptional()
  instituteId?: number;
} 