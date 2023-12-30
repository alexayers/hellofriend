import {DeleteMessageCommand, SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";

const client = new SQSClient({
    region: 'us-east-1'
});

export class QueueService {

    constructor(private queueName: string) {


    }

    async queue(object: any): Promise<any> {
        const command = new SendMessageCommand({
            QueueUrl: this.queueName,
            MessageBody: JSON.stringify(object),
        });

        try {
            const data = await client.send(command);
            console.log("Success", data);
            return data;
        } catch (error) {
            console.error("Error", error);
            throw error;
        }
    }

    async deleteMessage(receiptHandle): Promise<boolean> {
        const deleteParams = {
            QueueUrl: this.queueName,
            ReceiptHandle: receiptHandle,
        };

        try {
            await client.send(new DeleteMessageCommand(deleteParams));
            console.log("Message deleted successfully");
            return true;
        } catch (error) {
            console.error("Error deleting message:", error);
            return false;
        }
    }
}
