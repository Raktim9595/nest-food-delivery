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
	UseGuards,
	Req,
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
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthenticatedRequest } from "src/common/interfaces/auth";
import { controllerWrapper } from "src/utils/controllerWrapper";

@ApiTags("Users")
@Controller("api/v1/users")
export class UserController {
	constructor(private readonly userService: UserService) {}

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
		return controllerWrapper(async () => {
			const signUpStatus = await this.userService.create(createUserDto);
			return response.json({
				created: signUpStatus,
			});
		});
	}

	@Get()
	findAll() {
		return this.userService.findAll();
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
		const foundUser = await this.userService.findById(id);
		return response.json(foundUser);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Patch(":id")
	/**
	 * Update a user by id
	 * @param userToUpdateId ID of the user to update
	 * @param request The authenticated request, used to get the authenticated user's ID
	 * @param body The new user data
	 * @param response The express response object
	 * @returns A JSON response containing the status of the update
	 */
	async update(
		@Param("id", ParseIntPipe) userToUpdateId: number,
		@Req() request: AuthenticatedRequest,
		@Body() body: UpdateUserDto,
		@Res() response: Response,
	): Promise<Response> {
		return controllerWrapper(async () => {
			const updateUserServiceResult = await this.userService.updateById(
				userToUpdateId,
				request.id,
				body,
			);
			return response.json({ updated: updateUserServiceResult });
		});
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	@ApiBearerAuth()
	remove(
		@Param("id", ParseIntPipe) userIdToDelete: number,
		@Req() request: AuthenticatedRequest,
		@Res() response: Response,
	): Promise<Response> {
		return controllerWrapper(async () => {
			const deleteUserStatus = await this.userService.deleteById(
				userIdToDelete,
				request.id,
			);
			return response.json({ deleted: deleteUserStatus });
		});
	}
}
