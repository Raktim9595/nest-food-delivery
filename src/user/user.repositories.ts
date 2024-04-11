import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserRepositories {
	constructor(private readonly userPrismaClient: PrismaService) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = await this.userPrismaClient.user.create({
			data: createUserDto,
		});
		return user;
	}

	async findById(id: number): Promise<User> {
		const foundUser = await this.userPrismaClient.user.findUnique({
			where: {
				id,
			},
		});
		return foundUser;
	}

	async findByEmail(email: string): Promise<User> {
		const foundUser = await this.userPrismaClient.user.findUnique({
			where: {
				email,
			},
		});
		return foundUser;
	}

	async updateById(
		id: number,
		updateUserData: UpdateUserDto,
	): Promise<UpdateUserDto> {
		const updateResult = await this.userPrismaClient.user.update({
			where: {
				id,
			},
			data: updateUserData,
		});
		return updateResult;
	}

	async deleteById(id: number): Promise<User> {
		const deletedUser = await this.userPrismaClient.user.delete({
			where: { id },
		});

		return deletedUser;
	}
}
