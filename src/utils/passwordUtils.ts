import { Injectable } from "@nestjs/common";
import { hashSync, genSaltSync, compareSync } from "bcrypt";

@Injectable()
export class PasswordUtils {
	hashPassword(password: string, hashRounds: number) {
		const hashedData = hashSync(password, genSaltSync(hashRounds));
		return hashedData;
	}

	isMatch(hashedPassword: string, password: string): boolean {
		return compareSync(password, hashedPassword);
	}
}
