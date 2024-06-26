import { Exclude } from "class-transformer";

export class SignInResponseDto {
	id: number;
	username: string;

	@Exclude()
	password: string;

	@Exclude()
	fullName: string;

	@Exclude()
	address: string;

	@Exclude()
	phone: string;

	email: string;

	@Exclude()
	age: number;

	@Exclude()
	createdAt: Date;

	@Exclude()
	updatedAt: Date;

	accessToken: string;
	refreshToken: string;
}
