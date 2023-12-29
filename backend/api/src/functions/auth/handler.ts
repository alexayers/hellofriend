import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {middyfy} from "@libs/lambda/lambda";
import {LoginUser, RegisterUser} from "@libs/model/authenticationDtos";
import {accountService, authenticationService} from "@libs/services";
import {Account} from "@libs/model/account";
import {notValidResponse, successResponse} from "@libs/lambda/api-gateway";


export const register = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let registerUser: RegisterUser = event.body as unknown as RegisterUser;
    let result: string = await authenticationService.createCognitoUser(registerUser.email, registerUser.password);

    if (result) {

        let account: Account = await accountService.createAccount(registerUser, result);

        return successResponse({
            account
        });
    } else {
        return notValidResponse("Unable to register account");
    }
});

export const login = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let user: LoginUser = event.body as unknown as LoginUser;
    let response = await authenticationService.login(user.email, user.password);

    return successResponse({
        response
    });
})
