import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepositories } from "./user.repositories";
import { PasswordUtils } from "src/utils/passwordUtils";

@Module({
	controllers: [UserController],
	providers: [UserService, UserRepositories, PasswordUtils],
	exports: [UserRepositories, UserService],
})
export class UserModule {}
