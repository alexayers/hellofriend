import {AccountRepository} from "./accountRepository";
import {FollowerRepository} from "./followerRepository";
import {StatusRepository} from "./statusRepository";
import {TagRepository} from "./tagRepository";


const accountRepository: AccountRepository = new AccountRepository();
const followerRepository: FollowerRepository = new FollowerRepository();

const statusRepository : StatusRepository = new StatusRepository();
const tagRepository : TagRepository = new TagRepository();

export {accountRepository, followerRepository, statusRepository, tagRepository}
