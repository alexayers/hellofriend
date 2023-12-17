
import {AccountService} from "./accountService";
import {accountRepository} from "../repository";
import {AuthenticationService} from "./authenticationService";


const accountService : AccountService = new AccountService(accountRepository);
const authenticationService: AuthenticationService = new AuthenticationService(process.env.COGNITO_CLIENT_ID);


export { accountService, authenticationService };
