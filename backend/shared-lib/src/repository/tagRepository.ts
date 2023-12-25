import {BaseRepository, documentClient} from "./baseRepository";
import {GenericRepository} from "./genericRepository";
import {Tag} from "../model/tag";
import {QueryCommand, QueryCommandOutput, ScanCommand, ScanCommandOutput} from "@aws-sdk/lib-dynamodb";


export class TagRepository extends BaseRepository implements GenericRepository<Tag> {

    private _tableName: string = process.env.TAGS_TABLE;

    async persist(tag: Tag): Promise<Tag> {
        return await this.put(this._tableName, tag) as Tag;
    }

    async getByPkey(pkey: string): Promise<Tag> {
        return await super.byPkey(this._tableName, pkey) as Tag;
    }

    async findMatch(tagSearch: string) : Promise<Array<Tag>> {
        const params = {
            TableName: this._tableName,
            FilterExpression: "begins_with(#pkey, :pkeyPrefix)",
            ExpressionAttributeNames: {
                "#pkey": "pkey"
            },
            ExpressionAttributeValues: {
                ":pkeyPrefix": tagSearch
            }
        };

        try {
            const data : ScanCommandOutput = await documentClient.send(new ScanCommand(params));
            return data.Items as Array<Tag>;
        } catch (error) {
            console.error("Error", error);
            throw error;
        }
    }
}
