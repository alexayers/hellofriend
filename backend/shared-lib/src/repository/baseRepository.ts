import {v4 as uuidv4} from 'uuid';

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    QueryCommandInput,
    QueryCommandOutput
} from "@aws-sdk/lib-dynamodb";

const client: DynamoDBClient = new DynamoDBClient({region: "us-east-1"});
const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

export class BaseRepository {


    async put(tableName: string, skey: string, object: Object): Promise<Object> {

        object = {
            pkey: uuidv4(),
            skey: skey,
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            ...object
        };

        console.log({
            TableName: tableName,
            Item: object
        });

        const command: PutCommand = new PutCommand({
            TableName: tableName,
            Item: object
        });

        await documentClient.send(command);
        return object;
    }


    async query(params: QueryCommandInput): Promise<Object> {
        try {
            return await documentClient.send(new QueryCommand(params));
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    async queryForOne(params: QueryCommandInput): Promise<Object> {
        try {
            let results: QueryCommandOutput = await documentClient.send(new QueryCommand(params));
            return results.Items[0];
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }
}
