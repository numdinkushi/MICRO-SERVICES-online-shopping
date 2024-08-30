import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { UserService } from "app/service/userService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { container } from "tsyringe";
import 'app/utils/dependencyInjection';

const service = container.resolve(UserService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
    return service.CreateUser(event);
}).use(jsonBodyParser());


export const Login = middy((event: APIGatewayProxyEventV2) => {
    return service.UserLogin(event);
}).use(jsonBodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLocaleLowerCase();

    if (httpMethod === 'post') {
        return service.VerifyUser(event);
    }

    if (httpMethod === 'get') {
        return service.GetVerificationToken(event);
    }

    return service.ResponseWithError(event);
}).use(jsonBodyParser());

export const Profile = middy((event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLocaleLowerCase();

    if (httpMethod === 'post') {
        return service.CreateProfile(event);
    }

    if (httpMethod === 'put') {
        return service.EditProfile(event);
    }

    if (httpMethod === 'get') {
        return service.GetProfile(event);
    }

    return service.ResponseWithError(event);
}).use(jsonBodyParser());

export const Cart = middy((event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLocaleLowerCase();

    if (httpMethod === 'post') {
        return service.CreateCart(event);
    }

    if (httpMethod === 'put') {
        return service.UpdateCart(event);
    }

    if (httpMethod === 'get') {
        return service.GetCart(event);
    }

    return service.ResponseWithError(event);
}).use(jsonBodyParser());

export const Payment = middy((event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLocaleLowerCase();

    if (httpMethod === 'post') {
        return service.CreatePayment(event);
    }

    if (httpMethod === 'put') {
        return service.UpdatePayment(event);
    }

    if (httpMethod === 'get') {
        return service.GetPayment(event);
    }

    return service.ResponseWithError(event);
}).use(jsonBodyParser());
