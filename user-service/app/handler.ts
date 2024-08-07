import { APIGatewayProxyEventV2 } from "aws-lambda";

export const Signup =  async (event: APIGatewayProxyEventV2) => {
    console.log(888, event);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            message: "User registration successful",
            data: {}
        }),
    };
};
