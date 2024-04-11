import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PasswordUtils } from "src/utils/passwordUtils";
import { SignInDto } from "./dto/signIn-dto";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { SignInResponseDto } from "./dto/signin-response-dto";
import { plainToInstance } from "class-transformer";
import { AppConfigService } from "src/config/app/config.service";
import { AUTH_ERRORS } from "./enum/error";

@Injectable()
export class AuthService {
	constructor(
		private readonly passwordUtils: PasswordUtils,
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly appConfig: AppConfigService,
	) {}

	/**
	 * This method is used to sign in the user, it validates the user credentials,
	 * generates the access token and refresh token and returns the response
	 * @param signInDto The user's credentials to be validated
	 * @returns The user's details along with the access token
	 */
	async signIn({ email, password }: SignInDto): Promise<SignInResponseDto> {
		// fetching user from the database
		const foundUser = await this.userService.findByEmail(email);

		// comparing the encrypted password stored in database to the password sent by user
		const isPasswordMatch = this.passwordUtils.isMatch(
			foundUser.password,
			password,
		);

		// if password did not match than throw the error of invalid credentials
		if (!isPasswordMatch)
			throw new HttpException(
				AUTH_ERRORS.INVALID_CREDENTIALS,
				HttpStatus.UNAUTHORIZED,
			);

		// generate access token and refresh tokens using jwt services
		const accessToken = await this.jwtService.signAsync(
			{
				id: foundUser.id,
				email: foundUser.email,
			},
			{
				secret: this.appConfig.accessTokenSecret,
				expiresIn: "1d",
			},
		);

		// generate the refresh token along with the access token so when access token is expired we can generate new set of tokens using the refresh tokens
		const refreshToken = await this.jwtService.signAsync(
			{
				id: foundUser.id,
			},
			{
				secret: this.appConfig.refreshTokenSecret,
				expiresIn: "3d",
			},
		);

		// appending the accessToken for response format to pass to controllers
		const signInResponse: SignInResponseDto = {
			...foundUser,
			accessToken,
			refreshToken,
		};

		// mapping properly to the required sign In response dto
		return plainToInstance(SignInResponseDto, signInResponse);
	}
}
