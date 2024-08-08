import { headers } from "app/constants/constants";
import { UserRepository } from "app/repository/userRepository";
import { SuccessResponse } from "app/utils/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable, inject } from "tsyringe";
import { singleton } from "tsyringe";
import 'app/utils/dependencyInjection';

@singleton()
@autoInjectable()
export class UserService extends UserRepository {
    constructor(@inject('UserRepository') private repository: UserRepository) {
        super();
    }

    //user creation, validation and login
    async CreateUser(event: APIGatewayProxyEventV2) {
        const body = event.body;
        console.log(555, body);

        await this?.repository.CreateUserOperation();
        return SuccessResponse({ message: 'response from create user' });
    }

    async UserLogin(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from user login' });
    }
    async VerifyUser(event: APIGatewayProxyEventV2) {
        return SuccessResponse({ message: 'response from user VerifyUser' });
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