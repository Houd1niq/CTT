import { Injectable } from "@nestjs/common";
import { CreatePatentDto } from "./dto/patent.dto";

@Injectable()
export class PatentService {
  async createPatent(dto: CreatePatentDto) {
    return Promise.resolve(undefined);
  }
}
