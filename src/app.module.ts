import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AppConfigModule } from "./config/app/config.module";
import { AuthModule } from "./auth/auth.module";

@Module({
	imports: [AppConfigModule, UserModule, PrismaModule, AuthModule],
})
export class AppModule {}
