import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import * as process from "process";

export type PayloadType = {
  id: number;
  email: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      jsonWebTokenOptions: {
        maxAge: "60m",
      },
      secretOrKey: process.env.AT_SECRET,
    });
  }

  async validate(payload: PayloadType) {
    // const isRevoked = await this.revokedTokenService.checkIfRevoked(payload.id);
    // if (isRevoked) return false;
    return payload;
  }
}
