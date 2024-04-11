import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
	constructor(private configService: ConfigService) {}

	get port(): number {
		return this.configService.get<number>("app.port", { infer: true }) ?? 8080;
	}

	get passwordHashRounds(): string {
		return this.configService.get<string>("app.passwordHashRounds", {
			infer: true,
		});
	}

	get accessTokenSecret(): string {
		return this.configService.get<string>("app.accessTokenSecret", {
			infer: true,
		});
	}

	get refreshTokenSecret(): string {
		return this.configService.get<string>("app.refreshTokenSecret", {
			infer: true,
		});
	}
}
