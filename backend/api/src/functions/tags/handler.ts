import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {statusService} from "@libs/services";
import {notFoundResponse, successResponse} from "@libs/lambda/api-gateway";


export const tags = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let tag : string = event.pathParameters.tag;

    let accountID : string = event.requestContext.authorizer.claims.sub;
    let results = await statusService.getStatusByTag(accountID, tag);

    if (!results) {
        return notFoundResponse(`No statuses match the tag ${tag}`);
    }

    return successResponse({results});
});

