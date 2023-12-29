import fetch from "node-fetch";
import aws4 from "aws4";

export interface AccountSearchData {
    id: string
    username: string
    displayName: string
    summary: string
}

export interface TagSearchData {
    id: string
    tag: string
}

export interface StatusSearchData {
    id: string
    status: string
}

export class OpenSearchService {

    private static OPENSEARCH_ENDPOINT = process.env.OPENSEARCH_ENDPOINT;
    private static ACCOUNT_INDEX: string = "account-index";
    private static TAG_INDEX : string = "tag-index";
    private static STATUS_INDEX : string = "status-index";

    async createAccountIndex() : Promise<void> {
        const endpoint: string = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.ACCOUNT_INDEX}`
        const body: string = JSON.stringify({
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    username: { type: 'text' },
                    displayName: { type: 'text' },
                    summary: { type: 'text' }
                }
            }
        });

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'PUT',
            url: endpoint,
            path: `/${OpenSearchService.ACCOUNT_INDEX}`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async createTagIndex() : Promise<void> {
        const endpoint = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.TAG_INDEX}`
        const body = JSON.stringify({
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    tag: { type: 'text' }
                }
            }
        });

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'PUT',
            url: endpoint,
            path: `/${OpenSearchService.TAG_INDEX}`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async createStatusIndex() : Promise<void> {
        const endpoint = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.STATUS_INDEX}`
        const body = JSON.stringify({
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    status: { type: 'text' }
                }
            }
        });

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'PUT',
            url: endpoint,
            path: `/${OpenSearchService.STATUS_INDEX}`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);

    }

    private async signAndSend(request: any) : Promise<void> {
        aws4.sign(request, {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            sessionToken: process.env.AWS_SESSION_TOKEN
        });

        try {
            const response = await fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: request.body
            });

            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async storeAccount(accountSearchData : AccountSearchData) : Promise<void> {

    }

    async storeTag(tagSearchData : TagSearchData) : Promise<void> {

    }

    async storeStatus(statusSearchData : StatusSearchData) : Promise<void> {

    }

}
