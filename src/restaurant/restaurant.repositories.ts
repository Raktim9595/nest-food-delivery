import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateRestaurantRepoDto } from "./dto/create-restaurant.dto";
import { Restaurant } from "@prisma/client";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@Injectable()
export class RestaurantRepositories {
	constructor(private readonly prisma: PrismaService) {}

	async create(newRestaurantDto: CreateRestaurantRepoDto): Promise<Restaurant> {
		const newRestaurant = await this.prisma.restaurant.create({
			data: newRestaurantDto,
		});
		return newRestaurant;
	}

	async findById(id: number): Promise<Restaurant> {
		const foundRestaurant = await this.prisma.restaurant.findUnique({
			where: {
				id,
			},
		});
		return foundRestaurant;
	}

	async findByOwnerId(ownerId: number): Promise<Restaurant> {
		const foundRestaurant = await this.prisma.restaurant.findUnique({
			where: {
				ownerId,
			},
		});
		return foundRestaurant;
	}

	async findAll(): Promise<Restaurant[]> {
		const foundRestaurants = await this.prisma.restaurant.findMany();
		return foundRestaurants;
	}

	async updateById(
		id: number,
		updateRestaurantDto: UpdateRestaurantDto,
	): Promise<Restaurant> {
		const updatedRestaurant = await this.prisma.restaurant.update({
			where: {
				id,
			},
			data: updateRestaurantDto,
		});
		return updatedRestaurant;
	}
}
