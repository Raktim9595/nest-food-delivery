import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { SignInDto } from "./dto/signIn-dto";
import { SignInResponseDto } from "./dto/signin-response-dto";
import { Response } from "express";

@ApiTags("Auth")
@Controller("api/v1/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Sign in user
	 * @param body - user credentials
	 * @param response - response object to return the result
	 * @returns Promise with the result
	 */
	@Post("/signIn")
	@HttpCode(HttpStatus.OK)
	async signIn(
		@Body() body: SignInDto,
		@Res() response: Response<SignInResponseDto>,
	): Promise<Response<SignInResponseDto>> {
		const result = await this.authService.signIn(body);
		return response.json(result);
	}
}
