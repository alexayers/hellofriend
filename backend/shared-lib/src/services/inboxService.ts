import {accountService, fediverseService} from "./index";
import {actorFromUrl} from "../helpers/actorFromUrl";
import {PersonActor} from "../activityPub/actors/personActor";
import {APIGatewayProxyEventHeaders} from "aws-lambda";
import crypto from "crypto";
import {Account} from "../model/account";

export enum ValidationStatus {
    NO_RETRY,
    REFRESH,
    VALID
}

export class InboxService {


    async validateRequest(inboxUrl: string, headers: APIGatewayProxyEventHeaders): Promise<ValidationStatus> {

        let signature: string | undefined = headers["Signature"];

        if (!signature) {
            console.error("Header missing Signature");
            return ValidationStatus.NO_RETRY;
        }

        let date: string = headers["Date"];

        if (!date) {
            console.error("Header missing Date");
            return ValidationStatus.NO_RETRY;
        }

        let incomingDate : Date = new Date(date);
        const oneMinuteAgo: Date = new Date(incomingDate.getTime() - 60000);

        if (incomingDate < oneMinuteAgo) {
            console.error(`Date ${incomingDate} is older than 60 seconds ${oneMinuteAgo}.`);
            return ValidationStatus.NO_RETRY;
        }

        let signatureMap: Map<string, string> = this.extractSignature(signature);
        let expectedHeaders: string = this.extractExpectedHeaders(signatureMap, inboxUrl, headers);

        let keyId: string = signatureMap.get("keyId");
        let actor : {username: string, domain: string} = actorFromUrl(keyId);
        let account : Account = await accountService.getByNormalizedUsernameDomain(actor.username, actor.domain);

        if (account) {

            if (!account.publicKey) {
                return ValidationStatus.NO_RETRY;
            }

            return this.validateKey(account.publicKey, signatureMap.get("signature"), expectedHeaders);
        } else {
            let body = await fediverseService.signedRequest("get", keyId);
            let personActor: PersonActor = body as PersonActor;

            if (!personActor || !personActor.publicKey) {
                return ValidationStatus.NO_RETRY;
            }

            return this.validateKey(personActor.publicKey.publicKeyPem, signatureMap.get("signature"), expectedHeaders);
        }
    }

    private validateKey(publicKey: string, signature: string,expectedHeaders: string ) : ValidationStatus {

        const key : crypto.KeyObject = crypto.createPublicKey(publicKey);

        let isValid: boolean = crypto.verify(
            "sha256",
            Buffer.from(expectedHeaders, 'utf8'),
            {
                key: key,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(signature, 'base64')
        );

        return isValid ?  ValidationStatus.VALID : ValidationStatus.REFRESH;
    }

    private extractExpectedHeaders(signatureMap: Map<string, string>, inboxUrl: string, headers: APIGatewayProxyEventHeaders): string {

        let expectedHeaders: string = "";

        // Normalize header keys
        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                headers[key.toLowerCase()] = headers[key];
            }
        }

        let headerList: string[] = signatureMap.get("headers").split(" ");

        for (const header of headerList) {

            if (header == "(request-target)") {
                expectedHeaders += `(request-target): post ${inboxUrl}\n`;
            } else {
                expectedHeaders += `${header}: ${headers[header]}\n`;
            }
        }

        return expectedHeaders.substring(0, expectedHeaders.length - 1);
    }

    private extractSignature(signature: string): Map<string, string> {
        let parts: string[] = signature.split(",");
        let signatureMap: Map<string, string> = new Map();

        for (const part of parts) {
            let pair: string [] = part.split("=");
            let key: string = pair[0];
            let value: string = pair[1].replaceAll("\"", "");
            signatureMap.set(key, value);
        }

        return signatureMap;
    }
}
