import { Global, Module } from "@nestjs/common";
import { AppJwtTokenService } from "./appJwtToken.service";
import { AppConfigModule } from "src/config/app/config.module";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
	exports: [AppJwtTokenService],
	providers: [AppJwtTokenService, JwtService],
	imports: [AppConfigModule],
})
export class AppJwtTokenModule {}
