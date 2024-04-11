import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadDecoded } from "src/common/interfaces/auth";
import { AppConfigService } from "src/config/app/config.service";

@Injectable()
export class AppJwtTokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly appConfig: AppConfigService,
	) {}

	async generateAccessToken(id: number, email: string): Promise<string> {
		const accessToken = await this.jwtService.signAsync(
			{
				id,
				email,
			},
			{
				secret: this.appConfig.accessTokenSecret,
				expiresIn: "1d",
			},
		);
		return accessToken;
	}

	async generateRefreshToken(id: number): Promise<string> {
		const accessToken = await this.jwtService.signAsync(
			{
				id,
			},
			{
				secret: this.appConfig.refreshTokenSecret,
				expiresIn: "1d",
			},
		);
		return accessToken;
	}

	decodeAppJwtToken(token: string): JwtPayloadDecoded {
		const decoded: JwtPayloadDecoded = this.jwtService.verify(token, {
			secret: this.appConfig.accessTokenSecret,
		});
		return decoded;
	}
}
