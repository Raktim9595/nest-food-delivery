import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthenticatedRequest, JwtPayloadDecoded } from "../interfaces/auth";
import { AppJwtTokenService } from "src/utils/appJwtToken/appJwtToken.service";
import { AUTHORIZATION_ERRORS } from "src/errorEnum/authorizationError";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly appTokenService: AppJwtTokenService) {}

	/**
	 * Checks if the request contains a valid JWT token, if not it will
	 * throw an HttpException with a 401 status, if the token is expired
	 * or in invalid format it will throw an HttpException with a 403 status
	 * @param context The execution context, which contains the request we need to verify
	 */
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request: AuthenticatedRequest = context.switchToHttp().getRequest();

		try {
			const authHeader = request.headers.authorization;

			// If there is no token in the header we throw an error
			if (!authHeader) {
				throw new HttpException(
					AUTHORIZATION_ERRORS.NO_AUTH_TOKEN,
					HttpStatus.UNAUTHORIZED,
				);
			}

			// We extract the token from the header and check the format
			const [bearer, token] = authHeader.split(" ");
			if (bearer !== "Bearer" || !token) {
				throw new HttpException(
					AUTHORIZATION_ERRORS.INVALID_AUTH_TOKEN,
					HttpStatus.UNAUTHORIZED,
				);
			}

			// We verify the token using the secret
			const decoded: JwtPayloadDecoded =
				this.appTokenService.decodeAppJwtToken(token);

			//appending user id to the app request object
			request.id = decoded.id;
			return true;
		} catch (err) {
			// If the token is expired or in invalid format we throw an error
			throw new HttpException(
				AUTHORIZATION_ERRORS.INVALID_OR_EXPIRED,
				HttpStatus.UNAUTHORIZED,
			);
		}
	}
}
