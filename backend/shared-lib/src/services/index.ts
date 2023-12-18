import {AccountService} from "./accountService";
import {accountRepository} from "../repository";
import {AuthenticationService} from "./authenticationService";
import {FediverseService} from "./fediverseService";
import * as process from "process";


const accountService: AccountService = new AccountService(accountRepository);
const authenticationService: AuthenticationService = new AuthenticationService(process.env.COGNITO_CLIENT_ID);

const fediverseService : FediverseService = new FediverseService(process.env.DOMAIN);


export {accountService, authenticationService, fediverseService};
