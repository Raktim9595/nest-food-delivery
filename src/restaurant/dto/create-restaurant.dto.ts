import { IsNotEmpty, IsString } from "class-validator";

export class CreateRestaurantDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	location: string;

	images: string[];
}

export class CreateRestaurantRepoDto extends CreateRestaurantDto {
	ownerId: number;
}
