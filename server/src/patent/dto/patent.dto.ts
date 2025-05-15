import {
  IsNotEmpty,
  IsString,
  Matches,
} from "class-validator";

export class CreatePatentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  patentNumber: string;

  @IsString()
  @IsNotEmpty()
  dateOfRegistration: string;

  @IsString()
  @IsNotEmpty()
  dateOfExpiration: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @Matches(/false|true/, {
    message: "Значение должно быть 'true' или 'false'",
  })
  isPrivate?: string;

  @IsString()
  @IsNotEmpty()
  patentTypeId: string;

  @IsString()
  @IsNotEmpty()
  technologyFieldId: string;

  @IsString()
  @IsNotEmpty()
  instituteId: string;

  patentFile: any;
}


export class EditPatentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  patentNumber: string;

  @IsString()
  @IsNotEmpty()
  dateOfRegistration: string;

  @IsString()
  @IsNotEmpty()
  dateOfExpiration: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @Matches(/false|true/, {
    message: "Значение должно быть 'true' или 'false'",
  })
  isPrivate?: string;

  @IsString()
  @IsNotEmpty()
  patentTypeId: string;

  @IsString()
  @IsNotEmpty()
  technologyFieldId: string;
}
