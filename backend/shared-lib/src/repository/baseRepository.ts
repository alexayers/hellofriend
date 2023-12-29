import {DeleteItemCommand, DeleteItemCommandOutput, DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    QueryCommandInput,
    QueryCommandOutput
} from "@aws-sdk/lib-dynamodb";
import console from "console";
import * as AWSXRay from 'aws-xray-sdk-core';
import {BaseModel} from "../model/baseModel";

const client: DynamoDBClient = AWSXRay.captureAWSv3Client(new DynamoDBClient({region: "us-east-1"}));
export const documentClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

export class BaseRepository {


    protected async put(tableName: string, object: any): Promise<any> {

        let createTimeSeries: boolean = false;

        if (!object.createdAt) {

            createTimeSeries = true;
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

        try {

            if (createTimeSeries) {
                const command: PutCommand = new PutCommand({
                    TableName: process.env.TIMESERIES_TABLE,
                    Item: {
                        pkey: this.getCurrentDateFormatted(new Date()),
                        skey: `${object.objectName}#${Date.now()}`,
                        objectName: object.objectName,
                        compoundKey: `${object.pkey}$$${object.skey}`,

                    }
                });

                await documentClient.send(command);
            }

        } catch (e) {
            console.error(e);
        }

        return object;
    }

    protected getCurrentDateFormatted(now: Date) {
        const year : number = now.getFullYear();
        const month : string = String(now.getMonth() + 1).padStart(2, '0');
        const day: string = String(now.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`; // Format and return the date as YYYY-MM-DD
    }

    protected async byPkey(tableName: string, pkey: string): Promise<any> {
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


    protected async byPkeyAndSkey(tableName : string, pkey: string, skey: string) : Promise<any> {
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

    protected async byPkeyAndPartialSkey(tableName : string, pkey: string, skey: string) : Promise<any> {
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

    protected async query(params: QueryCommandInput): Promise<any> {
        try {
            const data: QueryCommandOutput = await documentClient.send(new QueryCommand(params));

            if (data.Items.length >= 1) {
                return data.Items;
            } else {
                return undefined;
            }

        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }

    protected async queryForOne(params: QueryCommandInput): Promise<any> {
        try {
            let results: QueryCommandOutput = await documentClient.send(new QueryCommand(params));

            if (results.Items.length == 1) {
                return results.Items[0];
            } else {
                return null;
            }

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

            await this.deleteTimeSeries(pkey, skey);

            return true;
        } catch (error) {
            console.error("Error deleting item:", error);
            return false;
        }
    }

    protected async deleteTimeSeries(pkey: string, skey: string) : Promise<boolean> {

        const params = {
            TableName: process.env.TIMESERIES_TABLE,
            IndexName: 'compound-index',
            KeyConditionExpression: 'compoundKey = :value',
            ExpressionAttributeValues: {
                ':value': `${pkey}$$${skey}`
            }
        }

        let result: {pkey : string, skey : number} = await this.queryForOne(params) as {pkey : string, skey : number};

        try {
            const command: DeleteItemCommand = new DeleteItemCommand(
                {
                    TableName: process.env.TIMESERIES_TABLE,
                    Key: {
                        "pkey": { S: result.pkey },
                        // @ts-ignore
                        "skey": { N: result.skey }
                    }
                });
            const response: DeleteItemCommandOutput = await client.send(command);
            console.log("Item deleted successfully", response);

            await this.deleteTimeSeries(pkey, skey);

            return true;
        } catch (error) {
            console.error("Error deleting item:", error);
            return false;
        }
    }
}
