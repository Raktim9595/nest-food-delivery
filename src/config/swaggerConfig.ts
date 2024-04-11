import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const swaggerConfig = (app: INestApplication) => {
	const config = new DocumentBuilder()
		.setTitle("Nestjs API Example")
		.setDescription("The description about learning the nestjs api")
		.setVersion("1.0")
		.addTag("Raktim Thapa")
		.addBearerAuth({
			description: "JWT Authentication",
			type: "http",
			in: "header",
			scheme: "Bearer",
			bearerFormat: "JWT",
		})
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document);
};

export default swaggerConfig;
