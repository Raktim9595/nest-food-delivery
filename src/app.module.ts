import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AppConfigModule } from "./config/app/config.module";
import { AuthModule } from "./auth/auth.module";
import { AppJwtTokenModule } from "./utils/appJwtToken/appJwtToken.module";
import { RestaurantModule } from "./restaurant/restaurant.module";

@Module({
	imports: [
		AppConfigModule,
		UserModule,
		PrismaModule,
		AuthModule,
		AppJwtTokenModule,
		RestaurantModule,
	],
})
export class AppModule {}
