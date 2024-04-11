import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepositories } from "./user.repositories";
import { UserResponseDto } from "./dto/user-response-dto";
import { plainToInstance } from "class-transformer";
import { USER_ERRORS } from "./enum/errors";
import { AppConfigService } from "src/config/app/config.service";
import { PasswordUtils } from "src/utils/passwordUtils";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
	constructor(
		private readonly userRepo: UserRepositories,
		private readonly appConfig: AppConfigService,
		private readonly passwordUtils: PasswordUtils,
	) {}

	/**
	 * This method is used to create a new user
	 * @param createAuthDto The user's data to be created
	 * @returns true if the user is created, false otherwise
	 */
	async create(createAuthDto: CreateUserDto): Promise<boolean> {
		// Check if the user with the given email already exists
		const foundUser = await this.userRepo.findByEmail(createAuthDto.email);
		if (foundUser) {
			// If the user already exists, throw a Conflict (409) error
			throw new HttpException(
				USER_ERRORS.USER_ALREADY_EXISTS,
				HttpStatus.CONFLICT,
			);
		}

		// Hash the user's password using the configured number of rounds
		const hashedPassword = this.passwordUtils.hashPassword(
			createAuthDto.password,
			parseInt(this.appConfig.passwordHashRounds, 10),
		);

		// Create the user with the hashed password
		const user = await this.userRepo.create({
			// Spread the createAuthDto properties to overwrite the password field
			...createAuthDto,
			password: hashedPassword,
		});
		// Return true if the user was created, false otherwise
		return !!user;
	}

	findAll() {
		return `This action returns all auth`;
	}

	/**
	 * This method is used to find a user by their email address
	 * @param email The user's email address
	 * @returns The found user, or a NOT_FOUND error if no user is found
	 */
	async findByEmail(email: string): Promise<UserResponseDto> {
		const foundUser = await this.userRepo.findByEmail(email);
		if (!foundUser)
			throw new HttpException(USER_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		// Return the found user
		return foundUser;
	}

	/**
	 * Find a user by their ID
	 * @param id The user's ID
	 * @returns The found user, or a NOT_FOUND error if no user is found
	 */
	async findById(id: number): Promise<UserResponseDto> {
		const foundUser = await this.userRepo.findById(id);
		if (!foundUser)
			throw new HttpException(USER_ERRORS.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		// Use class-transformer to convert the found user from a plain object
		// to an instance of the UserResponseDto class, which will have the
		// correct fields and types
		return plainToInstance(UserResponseDto, foundUser);
	}

	/**
	 * Update a user by their ID
	 * @param id The user's ID
	 * @param updateUserData The user's updated data
	 * @returns true if the user was updated, false otherwise
	 */
	async updateById(
		userToUpdateId: number,
		userId: number,
		updateUserData: UpdateUserDto,
	): Promise<boolean> {
		await this.findById(userToUpdateId);

		if (userToUpdateId !== userId) {
			// The user is not allowed to update another user
			throw new HttpException(
				USER_ERRORS.NOT_ALLOWED_TO_UPDATE,
				HttpStatus.UNAUTHORIZED,
			);
		}

		// Update the user with the given data
		const updateUserResult = await this.userRepo.updateById(
			userToUpdateId,
			updateUserData,
		);

		// Return true if the user was updated, false otherwise
		return !!updateUserResult;
	}

	/**
	 * Delete a user by their ID
	 * @param userIdToDelete The ID of the user to be deleted
	 * @param currentUserId The ID of the current user, who is requesting the deletion
	 * @returns true if the user was deleted, false otherwise
	 */
	async deleteById(
		userIdToDelete: number,
		currentUserId: number,
	): Promise<boolean> {
		// Find the user to be deleted
		await this.findById(userIdToDelete);

		if (userIdToDelete !== currentUserId) {
			// The user is not allowed to delete another user
			throw new HttpException(
				USER_ERRORS.NOT_ALLOWED_TO_DELETE,
				HttpStatus.UNAUTHORIZED,
			);
		}

		// Delete the user
		const deletedUser = await this.userRepo.deleteById(userIdToDelete);

		// Return true if the user was deleted, false otherwise
		return !!deletedUser;
	}
}
