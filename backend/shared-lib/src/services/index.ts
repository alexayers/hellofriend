import {AccountService} from "./accountService";
import {accountRepository, followerRepository} from "../repository";
import {AuthenticationService} from "./authenticationService";
import {FediverseService} from "./fediverseService";
import * as process from "process";
import {InboxService} from "./inboxService";
import {FollowService} from "./followService";


const accountService: AccountService = new AccountService(accountRepository);
const authenticationService: AuthenticationService = new AuthenticationService(process.env.COGNITO_CLIENT_ID);
const fediverseService : FediverseService = new FediverseService(process.env.DOMAIN);
const inboxSerivce : InboxService = new InboxService();
const followService: FollowService = new FollowService(process.env.DOMAIN, followerRepository);

export {accountService, authenticationService, fediverseService, inboxSerivce, followService};
