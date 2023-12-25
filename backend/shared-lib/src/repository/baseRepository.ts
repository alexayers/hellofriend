import {DeleteItemCommand, DeleteItemCommandOutput, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    QueryCommandInput,
    QueryCommandOutput
} from "@aws-sdk/lib-dynamodb";
import console from "console";

const client: DynamoDBClient = new DynamoDBClient({region: "us-east-1"});
export const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

export class BaseRepository {


    async put(tableName: string, object: any): Promise<any> {

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

    async byPkey(tableName: string, pkey: string): Promise<any> {
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

        console.log(params);

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


    async byPkeyAndSkey(tableName : string, pkey: string, skey: string) : Promise<any> {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#pkey = :pkey AND #skey = :skey",
            ExpressionAttributeNames: {
                "#pkey": "pkey",
                "#skey": "skey"
            },
            ExpressionAttributeValues: {
                ":pkey": pkey,
                ":skey": skey
            }
        };

        console.log(params);

        try {
            const data : QueryCommandOutput  = await client.send(new QueryCommand(params));

            if (data.Items.length == 1) {
                return data.Items[0];
            } else {
                return undefined;
            }

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async byPkeyAndPartialSkey(tableName : string, pkey: string, skey: string) : Promise<any> {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#pkey = :pkey AND begins_with(#skey, :skey)",
            ExpressionAttributeNames: {
                "#pkey": "pkey",
                "#skey": "skey"
            },
            ExpressionAttributeValues: {
                ":pkey": pkey,
                ":skey": skey
            }
        };

        console.log(params);

        try {
            const data : QueryCommandOutput  = await client.send(new QueryCommand(params));

            if (data.Items.length >= 1) {
                return data.Items;
            } else {
                return undefined;
            }

        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    async query(params: QueryCommandInput): Promise<any> {
        try {
            return await documentClient.send(new QueryCommand(params));
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    async queryForOne(params: QueryCommandInput): Promise<any> {
        try {
            let results: QueryCommandOutput = await documentClient.send(new QueryCommand(params));
            return results.Items[0];
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    protected async deleteItemByPkeyAndSkey(tableName: string, pkey: string, skey: string) : Promise<boolean> {
        try {
            const command: DeleteItemCommand = new DeleteItemCommand(
           {
                TableName: tableName,
                Key: {
                    "pkey": { S: pkey },
                    "skey": { S: skey }
                }
            });
            const response: DeleteItemCommandOutput = await client.send(command);
            console.log("Item deleted successfully", response);
            return true;
        } catch (error) {
            console.error("Error deleting item:", error);
            return false;
        }
    }
}
