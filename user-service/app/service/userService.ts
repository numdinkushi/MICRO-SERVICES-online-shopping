import { headers } from "app/constants/constants";
import { UserRepository } from "app/repository/userRepository";
import { ErrorResponse, SuccessResponse } from "app/utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable, inject } from "tsyringe";
import { singleton } from "tsyringe";
import 'app/utils/dependencyInjection';
import { plainToClass } from "class-transformer";
import { SignupInput } from "app/models/dto/signup-input";
import { AppValidation } from "app/utils/error";
import { GetHashedPassword, GeToken, GetSalt, ValidatePassword, VerifyToken } from "app/utils/password";
import { LoginInput } from "app/models/dto/login-input";
import { GenerateAccessCode, SendVerificationCode } from "app/utils/notification";
import { VerificationInput } from "app/models/dto/update-input";
import { timeDifference } from "app/utils/dateHelper";

@singleton()
@autoInjectable()
export class UserService extends UserRepository {
    constructor(@inject('UserRepository') private repository: UserRepository) {
        super();
    }

    async ResponseWithError(event: APIGatewayProxyEventV2) {
        return ErrorResponse(404, 'Request method not supported');
    }
    async CreateUser(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(SignupInput, event.body);
            const error = await AppValidation(input);
            if (error) return ErrorResponse(404, error);

            const salt = await GetSalt();
            const hashedPassword = await GetHashedPassword(input.password, salt);
            const data = await this.repository.createAccount({
                email: input.email,
                password: hashedPassword,
                salt,
                phone: input.phone,
                userType: 'Buyer'
            });

            if (data) {
                return SuccessResponse(data);
            }
        } catch (error) {
            console.log(`CREATE_USER_ERROR: ${error}`);
            return ErrorResponse(500, error);
        }
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(LoginInput, event.body);
            const error = await AppValidation(input);
            if (error) return ErrorResponse(404, error);

            const data = await this.repository.findAccount(input.email);
            const verified = await ValidatePassword(input.password, data?.password!, data?.salt!);
            if (!verified) {
                throw new Error('Password does not match');
            }

            const token = await GeToken(data!);

            if (data) {
                return SuccessResponse({ token });
            }
        } catch (error) {
            console.log(`CREATE_USER_ERROR: ${error}`);
            return ErrorResponse(500, error);
        }
    }

    async GetVerificationToken(event: APIGatewayProxyEventV2) {
        try {
            const token = event.headers.authorization;
            if (!token) {
                return ErrorResponse(403, 'Authorization token is missing');
            }

            const payload = await VerifyToken(token);
            if (!payload || !payload.user_id || !payload.phone) {
                throw new Error('Invalid token or missing user details');
            }

            const { code, expiry } = GenerateAccessCode();
            // Save to DB
            await this.updateVerification(payload.user_id, code, expiry);

            console.log(155, code, expiry);
            // const response = await SendVerificationCode(code, payload.phone);
            return SuccessResponse({ message: 'Verification code has been sent to your mobile number!' });
        } catch (error) {
            console.error('Error in GetVerificationToken:', error.message);
            return ErrorResponse(500, 'Failed to get verification token');
        }
    }

    async VerifyUser(event: APIGatewayProxyEventV2) {
        const token = event.headers.authorization;
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        const payload = await VerifyToken(token);
        if (!payload || !payload.user_id || !payload.phone) {
            throw new Error('Invalid token or missing user details');
        }

        const input = plainToClass(VerificationInput, event.body);
        const error = await AppValidation(input);
        if (error) return ErrorResponse(404, error);

        const { verification_code, expiry } = await this.findAccount(payload.email);
        // find user account
        if (verification_code === parseInt(input.code)) {
            // check expiration
            const currentTime = new Date();
            const difference = timeDifference(expiry!, currentTime.toISOString(), "m");
            console.log("time difference:", difference);
            if (difference < 0) return ErrorResponse(403, 'Verification code is expired');
            console.log('Verified successfully');

            //update DB
            await this.repository.updateVerifiedUser(payload.user_id)
        }

        return SuccessResponse({ message: 'User Verified' });
    }

    //user Profile
    async CreateProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from create profile' });
    }
    async GetProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from get user profile' });
    }
    async EditProfile(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from edit user profile' });
    }

    //cart
    async CreateCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from create cart' });
    }
    async GetCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from get cart' });
    }
    async UpdateCart(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from update cart' });
    }

    //payment
    async CreatePayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from create payment' });
    }
    async GetPayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from get payment' });
    }
    async UpdatePayment(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from update payment' });
    }
}