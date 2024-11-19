import {
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreatePatentTypeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
