import { Module } from "@nestjs/common";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";
import { RestaurantRepositories } from "./restaurant.repositories";

@Module({
	controllers: [RestaurantController],
	providers: [RestaurantService, RestaurantRepositories],
})
export class RestaurantModule {}
