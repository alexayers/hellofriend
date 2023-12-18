import {URL} from "url";
import fetch from "node-fetch";
import crypto from "crypto";
import {accountService} from "./index";
import {Account} from "../model/account";

export class FediverseService {

    constructor(private domain: string) {
    }

    async signedRequest(method: string, url: string): Promise<any> {

        let sendingUsername : string = "$hello.system$";
        let account: Account  = await accountService.getByNormalizedUsernameDomain(sendingUsername);

        if (!account) {
            console.error("Unable to find user");
            return;
        }

        const destinationHostname: string = new URL(url).hostname;
        const date: string = new Date().toUTCString();
        const digest: string = this.createSha256Digest("");
        const destinationPath: string = url.replace("https://","").replace(destinationHostname,"").replace("#main-key","");
        const stringToSign: string = `(request-target): ${method} ${destinationPath}\nhost: ${destinationHostname}\ndate: ${date}\ndigest: SHA-256=${digest}`;
        console.log(stringToSign)
        const signatureB64: string = this.signString(stringToSign, account.privateKey);
        let keyId: string = `https://${this.domain}/users/${sendingUsername}#main-key`;
        const signature: string = `keyId="${keyId}",algorithm="rsa-sha256",headers="(request-target) host date digest",signature="${signatureB64}"`;

        const response = await fetch(url, {
            method: 'get',
            headers: {
                "Date": date,
                "Signature": signature,
                "Digest": "SHA-256=" + digest,
                "Content-Type": "application/activity+json",
                "Accept": "application/activity+json",
            }
        });
        let body:any;

        console.debug(`Request to ${url} returned status: ${response.status}`);

        if (response.status == 200 || response.status == 202) {
            body = await response.json();
        }

        return body;
    }

    private signString(data: string, privateKeyStr: string): string {

        const sign = crypto.createSign('SHA256');
        sign.update(data);
        return sign.sign({
            key: privateKeyStr,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, 'base64');

    }

    private createSha256Digest(message: string): string {
        const hash: Buffer = crypto.createHash('sha256').update(message, 'utf8').digest();
        return hash.toString('base64');
    }
}
