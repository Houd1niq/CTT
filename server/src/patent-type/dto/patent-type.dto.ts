import {
  IsNotEmpty,
  IsString,
} from "class-validator";
import { SanitizeHtml } from "../../decorators/sanitize.decorator";

export class CreatePatentTypeDto {
    @SanitizeHtml()
    @IsString()
    @IsNotEmpty()
    name: string;
}
