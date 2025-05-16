import {IsEmail, IsInt, IsNotEmpty, IsString} from 'class-validator';
import { SanitizeHtml } from "../../decorators/sanitize.decorator";

export class CreateEmployeeDto {
  @SanitizeHtml()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsInt()
  instituteId: number;
}
