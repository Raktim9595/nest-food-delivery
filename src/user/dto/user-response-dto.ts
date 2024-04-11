import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class UserResponseDto {
	@ApiProperty({
		type: Number,
	})
	id: number;

	@ApiProperty({
		type: String,
	})
	username: string;

	@Exclude()
	password: string;

	@ApiProperty({
		type: String,
	})
	fullName: string;

	@ApiProperty({
		type: String,
	})
	address: string;

	@ApiProperty({
		type: String,
	})
	phone: string;
	@ApiProperty({
		type: String,
	})
	email: string;
	@ApiProperty({
		type: String,
	})
	@ApiProperty({
		type: String,
	})
	age: number;
}
