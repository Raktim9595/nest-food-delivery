import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Res,
	HttpCode,
	HttpStatus,
	ParseIntPipe,
	HttpException,
	UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Response } from "express";
import { CreationResponse } from "src/common/interfaces/response";
import { UserResponseDto } from "./dto/user-response-dto";
import {
	ApiBearerAuth,
	ApiExtraModels,
	ApiOkResponse,
	ApiTags,
	refs,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Users")
@Controller("api/v1/users")
export class UserController {
	constructor(private readonly authService: UserService) {}

	@Post("signUp")
	@HttpCode(HttpStatus.CREATED)
	/**
	 * Create a new user
	 * @param createUserDto The user's data
	 * @param response The response object
	 * @returns The sign-up status
	 */
	async create(
		@Body() createUserDto: CreateUserDto,
		@Res() response: Response<CreationResponse>,
	): Promise<Response<CreationResponse>> {
		try {
			const signUpStatus = await this.authService.create(createUserDto);
			return response.json({
				created: signUpStatus,
			});
		} catch (err) {
			throw new HttpException(err.message, 500);
		}
	}

	@Get()
	findAll() {
		return this.authService.findAll();
	}

	@Get(":id")
	@ApiExtraModels(UserResponseDto)
	@ApiOkResponse({
		schema: { anyOf: refs(UserResponseDto) },
	})
	/**
	 * Get a user by id
	 * @param id ID of the user to find
	 * @param response Express response object
	 * @returns A JSON response containing the user object
	 */
	@Get(":id")
	async findOne(
		@Param("id", ParseIntPipe) id: number,
		@Res() response: Response<UserResponseDto>,
	): Promise<Response<UserResponseDto>> {
		const foundUser = await this.authService.findById(id);
		return response.json(foundUser);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Patch(":id")
	update(@Param("id") id: string) {
		return this.authService.update(+id);
	}

	@Delete(":id")
	@ApiBearerAuth()
	remove(@Param("id") id: string) {
		return this.authService.remove(+id);
	}
}
