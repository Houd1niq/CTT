import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateTechnologyFieldDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
