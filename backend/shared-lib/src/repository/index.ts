import {AccountRepository} from "./accountRepository";
import {FollowerRepository} from "./followerRepository";
import {StatusRepository} from "./statusRepository";
import {TagRepository} from "./tagRepository";
import {FavoriteRepository} from "./favoriteRepository";
import {BookmarkRepository} from "./bookmarkRepository";
import {TimeSeriesRepository} from "./timeSeriesRepository";


const accountRepository: AccountRepository = new AccountRepository();
const followerRepository: FollowerRepository = new FollowerRepository();

const statusRepository: StatusRepository = new StatusRepository();
const tagRepository: TagRepository = new TagRepository();

const favoriteRepository: FavoriteRepository = new FavoriteRepository();
const bookmarkResository: BookmarkRepository = new BookmarkRepository();

const timeSeriesRepository : TimeSeriesRepository = new TimeSeriesRepository();

export {accountRepository, followerRepository, statusRepository, tagRepository, favoriteRepository, bookmarkResository,timeSeriesRepository}
