import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";

export const PatentFileInterceptor = () => FileInterceptor("patentFile", {
    storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Только в формате PDF"), false);
        }
    },
})
