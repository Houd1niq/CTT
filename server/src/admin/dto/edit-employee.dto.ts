import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { SanitizeHtml } from "../../decorators/sanitize.decorator";

export class EditEmployeeDto {
  @SanitizeHtml()
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