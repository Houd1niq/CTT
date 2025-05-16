import {IsEmail, IsInt, IsNotEmpty, IsString} from 'class-validator';

export class CreateEmployeeDto {
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
