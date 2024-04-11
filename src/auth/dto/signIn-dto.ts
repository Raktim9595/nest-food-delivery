import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({
		type: String,
	})
	email: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		type: String,
	})
	password: string;
}
