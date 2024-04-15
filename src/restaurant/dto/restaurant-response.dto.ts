import { Exclude } from "class-transformer";

export class RestaurantResponseDto {
	id: number;
	name: string;
	location: string;
	images: string[];
	ownerId: number;

	@Exclude()
	createdAt: Date;

	@Exclude()
	updatedAt: Date;
}

export class RestaurantListResponseDto {
	restaurants: RestaurantResponseDto[];
}
