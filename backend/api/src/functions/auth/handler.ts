import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {middyfy} from "@libs/lambda/lambda";
import {LoginUser, RefreshToken, RegisterUser} from "@libs/model/authenticationDtos";
import {accountService, authenticationService} from "@libs/services";
import {Account} from "@libs/model/account";
import {notAuthenticatedResponse, notValidResponse, successResponse} from "@libs/lambda/api-gateway";
import {AuthenticationResultType} from "@aws-sdk/client-cognito-identity-provider";


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

    try {
        let response: AuthenticationResultType = await authenticationService.login(user.email, user.password);

        return successResponse({
            idToken: response.IdToken,
            accessToken: response.AccessToken,
            refreshToken: response.RefreshToken,
            tokenType: response.IdToken,
            expiresIn: response.ExpiresIn
        });
    } catch (e) {
        return notAuthenticatedResponse(`Not authorized`);
    }
});

export const refreshToken = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let rt: RefreshToken = event.body as unknown as RefreshToken;


    try {
        let response: AuthenticationResultType = await authenticationService.refresh(rt.refreshToken);

        return successResponse({
            idToken: response.IdToken,
            accessToken: response.AccessToken,
            refreshToken: response.RefreshToken,
            tokenType: response.IdToken,
            expiresIn: response.ExpiresIn
        });
    } catch (e) {
        console.error(e);
        return notAuthenticatedResponse(`Not authorized`);
    }
});
