import {IsNotEmpty, IsString} from "class-validator";
import { SanitizeHtml } from "../../decorators/sanitize.decorator";

export class CreateInstituteDto {
  @SanitizeHtml()
  @IsString()
  @IsNotEmpty()
  name: string;
} 