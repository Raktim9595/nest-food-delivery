import { HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

export const controllerWrapper = async <T extends object>(
	controllerFunction: () => Promise<Response<T>>,
) => {
	try {
		return await controllerFunction();
	} catch (err) {
		throw new HttpException(
			err.message,
			err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
};
