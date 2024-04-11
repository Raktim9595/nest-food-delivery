import { registerAs } from "@nestjs/config";
export default registerAs("app", () => ({
	port: process.env.PORT,
	passwordHashRounds: process.env.PASSWORD_HASH_ROUNDS,
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
}));
