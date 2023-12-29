import fetch from "node-fetch";
import aws4 from "aws4";




export interface AccountSearchData {
    id: string
    username: string
    displayName: string
    domain: string
    summary: string
    avatarFilename:  string
    headerFilename: string
}

export interface TagSearchData {
    id: string
    tag: string
}

export interface StatusSearchData {
    id: string
    accountId: string
    status: string
    displayName: string
    domain: string
    username: string
    avatarFilename:  string
    published:  string
    language: string
    uri: string
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
                    domain: {type: 'text'},
                    summary: { type: 'text' },
                    avatarFilename:  { type: 'text' },
                    headerFilename: { type: 'text' },
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
                    status: { type: 'text' },
                    displayName: {type: 'text'},
                    accountId: {type: 'text'},
                    domain: {type: 'text'},
                    username: {type: 'text'},
                    avatarFilename:  { type: 'text' },
                    published:  { type: 'text' },
                    language:  { type: 'text' },
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

    private async signAndSend(request: any) : Promise<any> {

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
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async storeAccount(accountSearchData : AccountSearchData) : Promise<void> {
        const endpoint: string = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.ACCOUNT_INDEX}/_doc`

        const body : string = JSON.stringify(accountSearchData);


        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'POST',
            url: endpoint,
            path: `/${OpenSearchService.ACCOUNT_INDEX}/_doc`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async storeTag(tagSearchData : TagSearchData) : Promise<void> {
        const endpoint: string = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.TAG_INDEX}/_doc`

        const body : string = JSON.stringify(tagSearchData);

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'POST',
            url: endpoint,
            path: `/${OpenSearchService.TAG_INDEX}/_doc`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async storeStatus(statusSearchData : StatusSearchData) : Promise<void> {
        const endpoint: string = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.STATUS_INDEX}/_doc`

        const body : string = JSON.stringify(statusSearchData);

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'POST',
            url: endpoint,
            path: `/${OpenSearchService.STATUS_INDEX}/_doc`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async deleteAccountIndex() {
        const endpoint: string = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.ACCOUNT_INDEX}`;

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'DELETE',
            url: endpoint,
            path: `/${OpenSearchService.ACCOUNT_INDEX}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async deleteStatusIndex() {
        const endpoint: string = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.STATUS_INDEX}`;

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'DELETE',
            url: endpoint,
            path: `/${OpenSearchService.STATUS_INDEX}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async deleteTagIndex() {
        const endpoint: string = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.TAG_INDEX}`;

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'DELETE',
            url: endpoint,
            path: `/${OpenSearchService.TAG_INDEX}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await this.signAndSend(request);
    }

    async searchAccounts(searchString: string) : Promise<Array<AccountSearchData>> {
        const endpoint = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.ACCOUNT_INDEX}/_search`;
        const query = {
            query: {
                bool: {
                    should: [
                        { wildcard: { username: `*${searchString.toLowerCase()}*` }},
                        { wildcard: { displayName: `*${searchString.toLowerCase()}*` }}
                    ],
                    minimum_should_match: 1
                }
            }
        }

        console.log(query);

        const body = JSON.stringify(query);

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'POST',
            url: endpoint,
            path: `/${OpenSearchService.ACCOUNT_INDEX}/_search`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log(request);

        const response = await this.signAndSend(request);

        let accountResults : Array<AccountSearchData> = [];

        for (const hit of response.hits.hits) {

            console.log(hit);

            let source = hit._source;

            accountResults.push({
                avatarFilename: source?.avatarFilename,
                displayName: source.displayName,
                domain: source?.domain,
                headerFilename: source?.headerFilename,
                id: source.id,
                summary: source?.summary,
                username: source.username
            });
        }

        return accountResults;
    }

    async searchStatuses(searchString: string) : Promise<Array<StatusSearchData>> {
        const endpoint = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.STATUS_INDEX}/_search`;
        const query = {
            query: {
                wildcard: {
                    status: `*${searchString.toLowerCase()}*`
                }
            }
        };

        const body = JSON.stringify(query);

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'POST',
            url: endpoint,
            path: `/${OpenSearchService.STATUS_INDEX}/_search`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await this.signAndSend(request);

        let statusSearchData : Array<StatusSearchData> = [];

        for (const hit of response.hits.hits) {

            console.log(hit);

            let source = hit._source;

            statusSearchData.push({
                avatarFilename: source?.avatarFilename,
                displayName: source.displayName,
                domain: source?.domain,
                id: source.id,
                language: source?.language,
                published: source.published,
                status: source?.status,
                username: source.username,
                accountId: source.accountId,
                uri: source.uri

            });
        }

        return statusSearchData;

    }

    async searchTags(searchString: string) : Promise<Array<TagSearchData>> {
        const endpoint = `https://${OpenSearchService.OPENSEARCH_ENDPOINT}/${OpenSearchService.TAG_INDEX}/_search`;
        const query = {
            query: {
                wildcard: {
                    tag: `*${searchString.toLowerCase()}*`
                }
            }
        };

        const body = JSON.stringify(query);

        const request = {
            host: OpenSearchService.OPENSEARCH_ENDPOINT,
            method: 'POST',
            url: endpoint,
            path: `/${OpenSearchService.TAG_INDEX}/_search`,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await this.signAndSend(request);

        let tagSearchData : Array<TagSearchData> = [];

        for (const hit of response.hits.hits) {

            console.log(hit);

            let source = hit._source;

            tagSearchData.push({
                id: source.id,
                tag: source.tag
            });
        }

        return tagSearchData;

    }
}
