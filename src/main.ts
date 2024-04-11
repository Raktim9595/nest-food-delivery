import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import swaggerConfig from "./config/swaggerConfig";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn"],
	});
	const configService = app.get(ConfigService);
	const port = configService.get<number>("app.port");
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	swaggerConfig(app);
	await app.listen(port);
}
bootstrap();
