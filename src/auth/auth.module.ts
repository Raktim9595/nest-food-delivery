import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PasswordUtils } from "src/utils/passwordUtils";
import { UserModule } from "src/user/user.module";
import { JwtService } from "@nestjs/jwt";

@Module({
	controllers: [AuthController],
	providers: [AuthService, PasswordUtils, JwtService],
	imports: [UserModule],
})
export class AuthModule {}
