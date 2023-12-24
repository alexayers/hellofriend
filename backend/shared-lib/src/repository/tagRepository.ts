import {BaseRepository} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Tag} from "../model/tag";


export class TagRepository extends BaseRepository implements GenericRepository<Tag> {

    private _tableName: string = process.env.TAGS_TABLE;

    async persist(tag: Tag): Promise<Tag> {
        return await this.put(this._tableName, tag) as Tag;
    }

    async getByPkey(pkey: string): Promise<Tag> {
        return await super.byPkey(this._tableName, pkey) as Tag;
    }

}
