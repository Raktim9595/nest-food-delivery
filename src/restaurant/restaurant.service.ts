import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RestaurantRepositories } from "./restaurant.repositories";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import {
	RestaurantListResponseDto,
	RestaurantResponseDto,
} from "./dto/restaurant-response.dto";
import { RESTAURANT_ERRORS } from "./enum/errors";
import { plainToInstance } from "class-transformer";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@Injectable()
export class RestaurantService {
	constructor(private readonly restaurantRepo: RestaurantRepositories) {}

	/**
	 * Finds a restaurant by its ID
	 * @param id ID of the restaurant to find
	 * @returns A DTO with the restaurant information
	 */
	async findById(id: number): Promise<RestaurantResponseDto> {
		const foundRestaurant = await this.restaurantRepo.findById(id);

		//if restaurant is not found than it throws the http exception of status code 404
		if (!foundRestaurant)
			throw new HttpException(
				RESTAURANT_ERRORS.NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		return plainToInstance(RestaurantResponseDto, foundRestaurant);
	}

	/**
	 * Finds a restaurant by its owner ID
	 * @param ownerId ID of the owner of the restaurant to find
	 * @returns A DTO with the restaurant information
	 * @throws HttpException with status code 404 if the restaurant is not found
	 */
	async findByOwnerId(ownerId: number): Promise<RestaurantResponseDto> {
		const foundRestaurant = await this.restaurantRepo.findByOwnerId(ownerId);
		console.log(foundRestaurant);
		if (!foundRestaurant) {
			throw new HttpException(
				RESTAURANT_ERRORS.NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		}
		return plainToInstance(RestaurantResponseDto, foundRestaurant);
	}

	/**
	 * Creates a new restaurant
	 * @param newRestaurant DTO with the restaurant information
	 * @param currentUserId ID of the current user who is trying to create a restaurant
	 * @returns true if the restaurant is created, false otherwise
	 * @throws HttpException with status code 409 if the restaurant is already registered for the user
	 */
	async create(
		newRestaurant: CreateRestaurantDto,
		currentUserId: number,
	): Promise<boolean> {
		const foundOwnerRestaurant =
			await this.restaurantRepo.findByOwnerId(currentUserId);

		// if restaurant already registered for the user than throw the error
		if (foundOwnerRestaurant)
			throw new HttpException(
				RESTAURANT_ERRORS.ALREADY_REGISTERED,
				HttpStatus.CONFLICT,
			);

		const createdRestaurant = await this.restaurantRepo.create({
			...newRestaurant,
			ownerId: currentUserId,
		});
		return !!createdRestaurant;
	}

	/**
	 * Finds all restaurants
	 * @returns A list of DTOs with the restaurants information
	 */
	async findAll(): Promise<RestaurantListResponseDto> {
		const foundRestaurants = await this.restaurantRepo.findAll();
		return {
			// a list of restaurants
			restaurants: plainToInstance(RestaurantResponseDto, foundRestaurants),
		};
	}

	/**
	 * Updates a restaurant by its ID
	 * @param currentUserId ID of the current user who is trying to update the restaurant
	 * @param updateRestaurantPayload DTO with the new restaurant information
	 * @returns true if the restaurant is updated, false otherwise
	 * @throws HttpException with status code 401 if the user is not authorized to update the restaurant
	 */
	async updateById(
		updateRestaurantId: number,
		currentUserId: number,
		updateRestaurantPayload: UpdateRestaurantDto,
	): Promise<boolean> {
		const foundRestaurant = await this.findById(updateRestaurantId);
		if (foundRestaurant.ownerId !== currentUserId) {
			throw new HttpException(
				RESTAURANT_ERRORS.NOT_AUTHORIZED_TO_UPDATE,
				HttpStatus.UNAUTHORIZED,
			);
		}

		const updatedRestaurant = await this.restaurantRepo.updateById(
			updateRestaurantId,
			updateRestaurantPayload,
		);
		return !!updatedRestaurant;
	}
}
