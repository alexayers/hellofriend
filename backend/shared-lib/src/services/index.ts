import {AccountService} from "./accountService";
import {AuthenticationService} from "./authenticationService";
import {FediverseService} from "./fediverseService";
import * as process from "process";
import {InboxService} from "./inboxService";
import {FollowService} from "./followService";
import {QueueService} from "./queueService";
import {StatusService} from "./statusService";
import {WebFingerService} from "./webFingerService";
import {TagService} from "./tagService";
import {FileSystemService} from "./fileSystemService";


const accountService: AccountService = new AccountService();
const authenticationService: AuthenticationService = new AuthenticationService(process.env.COGNITO_CLIENT_ID);
const fediverseService : FediverseService = new FediverseService(process.env.DOMAIN);
const inboxSerivce : InboxService = new InboxService();
const webFingerService : WebFingerService = new WebFingerService();
const followService: FollowService = new FollowService(process.env.DOMAIN);
const statusService: StatusService = new StatusService(process.env.DOMAIN);

const inboundQueueService : QueueService = new QueueService(process.env.INBOUND_QUEUE);
const outboundQueueService : QueueService = new QueueService(process.env.OUTBOUND_QUEUE);

const fileSystemService : FileSystemService = new FileSystemService(process.env.FILES_BUCKET);

const tagService : TagService = new TagService();

export {accountService,
    webFingerService,
    authenticationService,
    fediverseService,
    inboxSerivce,
    followService,
    inboundQueueService,
    statusService,
    outboundQueueService,
    tagService,
    fileSystemService
};
