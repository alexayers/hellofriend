import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";

const client = new SQSClient({
    region: 'us-east-1'
});

export class QueueService {

    constructor(private queueName: string) {


    }

    async queue(object: any) {
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
}
