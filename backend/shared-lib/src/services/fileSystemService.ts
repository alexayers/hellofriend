import {DeleteObjectCommand, DeleteObjectOutput, PutObjectRequest, S3Client} from "@aws-sdk/client-s3";
import {PersonActor} from "../activityPub/actors/personActor";
import {v4 as uuidv4} from 'uuid';
import console from "console";
import {Upload} from "@aws-sdk/lib-storage";
import fetch from 'node-fetch';

export interface S3Data {
    key: string
    body: any
    contentType: string
}
export interface FileUpload {
    buffer: ArrayBuffer
    filename: string
    contentType: string
}

export class FileSystemService {

    private readonly _client: S3Client;

    constructor(private s3Bucket: string) {
        this._client = new S3Client({
            region: "us-east-1"
        });
    }

    async processPerson(person: PersonActor): Promise<PersonActor> {

        if (person.icon && person.icon.url) {
            console.info(`Downloading avatar for ${person.preferredUsername}`);
            const response = await fetch(person.icon.url, {
                method: 'get',
                headers: {
                    "Accept": person.icon.mediaType
                }
            });

            try {
                let extension: string = person.icon.mediaType.split("/")[1];
                let avatarPath: string = `avatars/${uuidv4()}.${extension}`;


                let avatarFilename: string = `${this.s3Bucket}/${avatarPath}`;
                let data: ArrayBuffer = await response.arrayBuffer();

                await this.uploadData(this.s3Bucket, {
                    key: avatarPath,
                    body: Buffer.from(data),
                    contentType: person.icon.mediaType
                });
                person.icon.filename = avatarPath;
                person.icon.size = Buffer.from(data).byteLength;

                console.info(`Wrote avatar to ${avatarFilename}`);
            } catch (e) {
                console.error(e);
            }
        }

        if (person.image && person.image.url) {
            console.info(`Downloading header for ${person.preferredUsername}`);
            const response = await fetch(person.image.url, {
                method: 'get',
                headers: {
                    "Accept": person.image.mediaType
                }
            });

            try {
                let extension: string = person.image.mediaType.split("/")[1];
                let headerPath: string = `headers/${uuidv4()}.${extension}`;
                let headerFilename: string = `${this.s3Bucket}/${headerPath}`;
                let data: ArrayBuffer = await response.arrayBuffer();

                await this.uploadData(this.s3Bucket, {
                    key: headerPath,
                    body: Buffer.from(data),
                    contentType: person.image.mediaType
                });
                person.image.filename = headerPath;
                person.image.size = Buffer.from(data).byteLength;

                console.info(`Wrote header to ${headerFilename}`);
            } catch (e) {
                console.error(e);
            }
        }

        return person;
    }

    private async uploadData(bucket: string, s3Data: S3Data) {
        let params: PutObjectRequest = {
            Bucket: bucket,
            Key: s3Data.key,
            Body: s3Data.body,
            ContentType: s3Data.contentType
        };

        const uploads3: Upload = new Upload({
            client: this._client,
            params
        });

        await uploads3.done();
    }

    async delete(filename: string) {
        const deleteParams = {
            Bucket: this.s3Bucket,
            Key: filename,
        };

        try {
            const deleteCommand: DeleteObjectCommand = new DeleteObjectCommand(deleteParams);
            const response: DeleteObjectOutput = await this._client.send(deleteCommand);
            console.log("File deleted successfully", response);
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }
}
