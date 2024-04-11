import * as Joi from "joi";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configuration";
import { AppConfigService } from "./config.service";

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			validationSchema: Joi.object({
				port: Joi.number().default(8080),
				passwordHashRounds: Joi.string().default(10),
				accessTokenSecret: Joi.string().default("test"),
				refreshTokenSecret: Joi.string().default("refresh"),
			}),
		}),
	],
	providers: [ConfigService, AppConfigService],
	exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
