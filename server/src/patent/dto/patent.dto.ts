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

    patentFile: any;
}
