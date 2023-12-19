import {AccountRepository} from "./accountRepository";
import {FollowerRepository} from "./followerRepository";


const accountRepository: AccountRepository = new AccountRepository();
const followerRepository: FollowerRepository = new FollowerRepository();

export {accountRepository, followerRepository}
