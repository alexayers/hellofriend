import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    QueryCommandInput,
    QueryCommandOutput
} from "@aws-sdk/lib-dynamodb";
import console from "console";
import {BaseModel} from "../model/baseModel";

const client: DynamoDBClient = new DynamoDBClient({region: "us-east-1"});
export const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

export class BaseRepository {


    async put(tableName: string, object: any): Promise<Object> {

        if (!object.createdAt) {
            object = {
                createdAt: Date.now(),
                modifiedAt: Date.now(),
                ...object
            };
        } else {
            object.modifiedAt = Date.now();
        }

        console.log({
            TableName: tableName,
            Item: object
        });

        try {
            const command: PutCommand = new PutCommand({
                TableName: tableName,
                Item: object
            });

            await documentClient.send(command);
        } catch (e) {
            console.error(e);
        }

        return object;
    }

    async byPkey(tableName: string, pkey: string) : Promise<Object> {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#pkey = :pkey",
            ExpressionAttributeNames: {
                "#pkey": "pkey"
            },
            ExpressionAttributeValues: {
                ":pkey": pkey
            }
        };

        try {
            const data = await client.send(new QueryCommand(params));

            if (data.Items.length == 1) {
                return data.Items[0];
            } else {
                return undefined
            }

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
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
