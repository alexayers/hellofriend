import {
    AuthenticationResultType,
    AuthFlowType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    InitiateAuthCommandOutput,
    SignUpCommand,
    SignUpCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import {RefreshToken} from "../model/authenticationDtos";

const client = new CognitoIdentityProviderClient({region: "us-east-1"});

export class AuthenticationService {

    constructor(private cognitoUserPoolClientId) {
    }

    async createCognitoUser(email: string, password: string): Promise<string> {

        const params = {
            ClientId: this.cognitoUserPoolClientId,
            Username: email,
            Password: password,
            UserAttributes: [
                {
                    Name: "email",
                    Value: email
                }
            ]
        };

        try {
            const command: SignUpCommand = new SignUpCommand(params);
            const response: SignUpCommandOutput = await client.send(command);

            console.log("User registration successful", response);
            return response.UserSub;
        } catch (error) {
            console.error("Error in user registration", error);
            return null;
        }
    }

    async login(email: string, password: string): Promise<AuthenticationResultType> {
        const params = {
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: this.cognitoUserPoolClientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        };

        const command: InitiateAuthCommand = new InitiateAuthCommand(params);
        const response: InitiateAuthCommandOutput = await client.send(command);
        return response.AuthenticationResult;
    }

    async refresh(refreshToken: string) {
        const command = new InitiateAuthCommand({
            AuthFlow: AuthFlowType.REFRESH_TOKEN,
            ClientId: this.cognitoUserPoolClientId,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken
            },
        });



        const response: InitiateAuthCommandOutput = await client.send(command);
        return response.AuthenticationResult;
    }
}
