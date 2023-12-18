import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from "aws-lambda"
import type {FromSchema} from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const successResponse = (response: Record<string, unknown>) => {
    return {
        statusCode: 200,
        body: JSON.stringify(response)
    }
}

export const notValidResponse = (errorMessage: string) => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            "errorMessage": errorMessage
        })
    }
}

export const notFoundResponse = (errorMessage: string) => {
    return {
        statusCode: 404,
        body: JSON.stringify({
            "errorMessage": errorMessage
        })
    }
}

export const notAuthenticatedResponse = (errorMessage: string) => {
    return {
        statusCode: 401,
        body: JSON.stringify({
            "errorMessage": errorMessage
        })
    }
}
