import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepositories } from "./user.repositories";
import { UserResponseDto } from "./dto/user-response-dto";
import { plainToInstance } from "class-transformer";
import { USER_ERRORS } from "./enum/errors";
import { AppConfigService } from "src/config/app/config.service";
import { PasswordUtils } from "src/utils/passwordUtils";

@Injectable()
export class UserService {
	constructor(
		private readonly authRepo: UserRepositories,
		private readonly appConfig: AppConfigService,
		private readonly passwordUtils: PasswordUtils,
	) {}

	async create(createAuthDto: CreateUserDto): Promise<boolean> {
		const foundUser = await this.authRepo.findByEmail(createAuthDto.email);
		if (foundUser) {
			throw new HttpException(
				USER_ERRORS.USER_ALREADY_EXISTS,
				HttpStatus.CONFLICT,
			);
		}

		const hashedPassword = this.passwordUtils.hashPassword(
			createAuthDto.password,
			parseInt(this.appConfig.passwordHashRounds, 10),
		);

		const user = await this.authRepo.create({
			...createAuthDto,
			password: hashedPassword,
		});
		return !!user;
	}

	findAll() {
		return `This action returns all auth`;
	}

	async findByEmail(email: string): Promise<UserResponseDto> {
		const foundUser = await this.authRepo.findByEmail(email);
		if (!foundUser)
			throw new HttpException(USER_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		return foundUser;
	}

	async findById(id: number): Promise<UserResponseDto> {
		const foundUser = await this.authRepo.findById(id);
		if (!foundUser)
			throw new HttpException(USER_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		return plainToInstance(UserResponseDto, foundUser);
	}

	update(id: number) {
		return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	}
}
