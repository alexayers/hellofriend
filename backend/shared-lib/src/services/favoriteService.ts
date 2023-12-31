import {Favorite} from "../model/favorite";
import {bookmarkResository, favoriteRepository, statusRepository} from "../repository";
import {StatusDto} from "../dto/statusDto";
import {Status} from "../model/status";


export class FavoriteService {

    async addFavorite(accountID: string, statusID: string): Promise<Favorite> {

        const status: Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return null;
        }

        return await favoriteRepository.persist({
                objectName: "Favorite",
                pkey: accountID,
                skey: statusID,
                status: {
                    account: status.account,
                    id: status.pkey,
                    text: status.content,
                    spoilerText: status.spoilerText,
                    published: status.published,
                    uri: status.uri,
                    totalLikes: 0,
                    isFavorite: true,
                    isBookmark: false
                }
            }
        );
    }

    async removeFavorite(accountID: string, statusID: string): Promise<boolean> {

        const status: Status = await statusRepository.getStatusById(statusID);

        if (!status) {
            return false;
        }

        return await favoriteRepository.delete(accountID, statusID);
    }

    async getFavorites(accountID: string): Promise<Array<Favorite>> {
        return await favoriteRepository.getFavorites(accountID);
    }

    async isFavorited(accountID: string, statusID: string) {
        return await favoriteRepository.isFavorited(accountID, statusID);
    }

    async areFavorited(accountID: string, statusIDs: string[]): Promise<boolean[]> {
        return await favoriteRepository.areFavorited(accountID, statusIDs);
    }
}
