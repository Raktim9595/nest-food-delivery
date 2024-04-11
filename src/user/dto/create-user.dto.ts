import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		type: String,
	})
	username: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		type: String,
	})
	password: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		type: String,
	})
	fullName: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		type: String,
	})
	address: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		type: String,
	})
	phone: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@ApiProperty({
		type: String,
	})
	email: string;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({
		type: Number,
	})
	age: number;
}
