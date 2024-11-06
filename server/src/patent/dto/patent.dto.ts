import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
} from "class-validator";

export class CreatePatentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, {
    message: "Дата должна быть в формате dd.mm.yyyy",
  })
  @IsNotEmpty()
  dateOfRegistration: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\.\d{2}\.\d{4}$/, {
    message: "Дата должна быть в формате dd.mm.yyyy",
  })
  dateOfExpiration: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsBoolean()
  isPrivate?: boolean;

  @IsInt()
  @IsNotEmpty()
  patentTypeId: number;

  @IsInt()
  @IsNotEmpty()
  technologyFieldId: number;
}
