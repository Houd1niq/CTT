import {
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";
import {SanitizeHtml} from "../../decorators/sanitize.decorator";

export class CreatePatentDto {
  @SanitizeHtml()
  @IsString()
  @IsNotEmpty()
  name: string;

  @SanitizeHtml()
  @IsString()
  @IsNotEmpty()
  patentNumber: string;

  @IsString()
  @IsNotEmpty()
  dateOfRegistration: string;

  @IsString()
  @IsNotEmpty()
  dateOfExpiration: string;

  @SanitizeHtml()
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
  @SanitizeHtml()
  @IsString()
  @IsNotEmpty()
  name: string;

  @SanitizeHtml()
  @IsString()
  @IsNotEmpty()
  patentNumber: string;

  @IsString()
  @IsNotEmpty()
  dateOfRegistration: string;

  @IsString()
  @IsNotEmpty()
  dateOfExpiration: string;

  @SanitizeHtml()
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
}
