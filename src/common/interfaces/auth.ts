import { Request } from "express";

export type JwtPayloadDecoded = {
	id: number;
	email: string;
};

export type AuthenticatedRequest = Request & {
	id: number;
};
