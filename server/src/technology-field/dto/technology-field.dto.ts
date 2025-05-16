import {
  IsNotEmpty,
  IsString,
} from "class-validator";
import { SanitizeHtml } from "../../decorators/sanitize.decorator";

export class CreateTechnologyFieldDto {
    @SanitizeHtml()
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class EditTechnologyFieldDto {
    @SanitizeHtml()
    @IsString()
    @IsNotEmpty()
    name: string;
}
