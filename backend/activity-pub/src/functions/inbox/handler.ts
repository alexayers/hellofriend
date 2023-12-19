import {middyfy} from "@libs/lambda/lambda";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {inboxSerivce} from "@libs/services";
import {notAuthenticatedResponse, successResponse} from "@libs/lambda/api-gateway";
import {ValidationStatus} from "@libs/services/inboxService";


export const sharedInbox = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let validationStatus : ValidationStatus = await inboxSerivce.validateRequest("/activitypub/inbox",event.headers);

    if (validationStatus != ValidationStatus.VALID) {
        return notAuthenticatedResponse("Unable to validate request")
    }

    return successResponse({"Success": true});
});


