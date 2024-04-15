import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import {
	CreationResponse,
	UpdateResponse,
} from "src/common/interfaces/response";
import { AuthenticatedRequest } from "src/common/interfaces/auth";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { controllerWrapper } from "src/utils/controllerWrapper";
import { Response } from "express";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import {
	RestaurantListResponseDto,
	RestaurantResponseDto,
} from "./dto/restaurant-response.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

@ApiTags("Restaurants")
@Controller("api/v1/restaurant")
export class RestaurantController {
	constructor(private readonly restaurantServices: RestaurantService) {}

	/**
	 * Create a new restaurant
	 * @param request The request object containing the authenticated user's id
	 * @param body The request body containing the restaurant details
	 * @param response The response object to be sent back to the client
	 * @returns The response object with the creation status
	 */
	@UseGuards(JwtAuthGuard)
	@Post("/")
	@HttpCode(HttpStatus.CREATED)
	@ApiBearerAuth()
	async create(
		@Req() request: AuthenticatedRequest,
		@Body() body: CreateRestaurantDto,
		@Res() response: Response<CreationResponse>,
	): Promise<Response<CreationResponse>> {
		return controllerWrapper(async () => {
			// Call the service to create a new restaurant
			const createRestaurantResponse = await this.restaurantServices.create(
				body,
				request.id,
			);
			// Send the response to the client
			return response.json({ created: createRestaurantResponse });
		});
	}

	/**
	 * Retrieves all the restaurants available
	 * @param response The response object to be sent back to the client
	 * @returns The response object with the list of all the restaurants
	 */
	@Get("/")
	@ApiOkResponse({
		description: "List of all the restaurants available",
	})
	async findAll(
		@Res() response: Response<RestaurantListResponseDto>,
	): Promise<Response<RestaurantListResponseDto>> {
		return controllerWrapper(async () => {
			// Call the service to find all the restaurants
			const foundRestaurants = await this.restaurantServices.findAll();
			// Send the response to the client
			return response.json(foundRestaurants);
		});
	}

	/**
	 * Retrieves a single restaurant by its ID
	 * @param id The ID of the restaurant to retrieve
	 * @param response The response object to be sent back to the client
	 * @returns The response object with the restaurant information
	 */
	@Get(":id")
	@ApiOkResponse({
		description: "The one restaurant",
	})
	async findById(
		@Param("id", ParseIntPipe) id: number,
		@Res() response: Response<RestaurantResponseDto>,
	) {
		return controllerWrapper(async () => {
			const foundRestaurant = await this.restaurantServices.findById(id);
			return response.json(foundRestaurant);
		});
	}

	/**
	 * Updates a restaurant by its ID
	 * @param request The authenticated request, used to get the authenticated user's ID
	 * @param response The response object to be sent back to the client
	 * @param id The ID of the restaurant to update
	 * @param body The new restaurant data
	 * @returns A JSON response containing the status of the update
	 */
	@UseGuards(JwtAuthGuard)
	@Patch(":id")
	@ApiBearerAuth()
	@ApiOkResponse({
		description: "The status of the updated restaurant",
	})
	async updateById(
		@Req() request: AuthenticatedRequest,
		@Res() response: Response<UpdateResponse>,
		@Param("id", ParseIntPipe) id: number,
		@Body() body: UpdateRestaurantDto,
	): Promise<Response<UpdateResponse>> {
		return controllerWrapper(async () => {
			const updateRestaurantResponse = await this.restaurantServices.updateById(
				id,
				request.id,
				body,
			);
			return response.json({ updated: updateRestaurantResponse });
		});
	}
}
