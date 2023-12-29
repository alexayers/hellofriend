import type { AWS } from '@serverless/typescript';
import configuration from "../configuration";

// We'll use this resourcePrefix for all our resources: OpenSearch, Cognito, etc.
const resourcePrefix: string = configuration.resourcePrefix;

export const serverlessConfiguration: AWS = {
    service: 'hello-friend-opensearch',
    frameworkVersion: '3',
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        stage: 'dev',
        logRetentionInDays: 3,
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            AWS_ACCOUNT_ID: { 'Fn::Sub': '${AWS::AccountId}' },
        },
    },
    package: { individually: true },
    custom: {},
    resources: {
        Resources: {
            /*
             -=-=-=-=-=-=-=-=-=-=-=-
                 OPENSEARCH
             -=-=-=-=-=-=-=-=-=-=-=-
             */
            OpenSearchDomain: {
                Type: 'AWS::OpenSearchService::Domain',
                Properties: {
                    DomainName: `${resourcePrefix}-domain`,
                    EngineVersion: 'OpenSearch_2.11', // Specify the version of OpenSearch
                    ClusterConfig: {
                        InstanceType: 't3.small.search',
                        InstanceCount: 1,
                    },
                    AccessPolicies: {
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Effect: "Allow",
                                Principal: {
                                    AWS: {
                                        "Fn::Sub": `arn:aws:iam::\${AWS::AccountId}:role/hello-friend-timeline-dev-\${AWS::Region}-lambdaRole`
                                    }
                                },
                                Action: "es:*",
                                Resource: {
                                    "Fn::Sub": `arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/${resourcePrefix}-domain/*`
                                }
                            }
                        ]
                    },
                    EBSOptions: {
                        EBSEnabled: true,
                        VolumeSize: 10,
                        VolumeType: 'gp3',
                    },
                }
            },
        },
        Outputs: {
            OpenSearchDomainEndpoint: {
                Value: {
                    'Fn::GetAtt': ['OpenSearchDomain', 'DomainEndpoint'],
                },
                Export: {
                    Name: `${resourcePrefix}-OpenSearchEndpoint`,
                },
            },
            OpenSearchDomainARN: {
                Value: {
                    'Fn::GetAtt': ['OpenSearchDomain', 'DomainArn'],
                },
                Export: {
                    Name: `${resourcePrefix}-OpenSearchDomainARN`,
                },
            },
        }
    },
};

module.exports = serverlessConfiguration;
