import type {AWS} from '@serverless/typescript';
import configuration from "../configuration";

// We'll use this resourcePrefix for all our resources: dynamoDB, Cognito, etc
const resourcePrefix: string = configuration.resourcePrefix;


export const serverlessConfiguration: AWS = {
    service: 'hello-friend-database',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        stage: 'dev',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
        },
    },
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node20',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
    resources: {
        Resources: {
            /*
         -=-=-=-=-=-=-=-=-=-=-=-
             DYNAMODB
         -=-=-=-=-=-=-=-=-=-=-=-
         */

            AccountsTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: `${resourcePrefix}-accounts`,
                    AttributeDefinitions: [
                        {
                            AttributeName: "pkey",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "skey",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "normalizedUserDomain",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "uri",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "url",
                            AttributeType: "S",
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "pkey",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "skey",
                            KeyType: "RANGE"
                        }],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: "normalized-user-domain-index",
                            KeySchema: [
                                {
                                    AttributeName: "normalizedUserDomain",
                                    KeyType: "HASH",
                                }
                            ],
                            Projection: {
                                ProjectionType: "ALL"
                            },
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                        {
                            IndexName: "uri-index",
                            KeySchema: [
                                {
                                    AttributeName: "uri",
                                    KeyType: "HASH",
                                }
                            ],
                            Projection: {
                                ProjectionType: "ALL"
                            },
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                        {
                            IndexName: "url-index",
                            KeySchema: [
                                {
                                    AttributeName: "url",
                                    KeyType: "HASH",
                                }
                            ],
                            Projection: {
                                ProjectionType: "ALL"
                            },
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    },
                }
            },
            FollowsTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: `${resourcePrefix}-follows`,
                    AttributeDefinitions: [
                        {
                            AttributeName: "pkey",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "skey",
                            AttributeType: "S",
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "pkey",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "skey",
                            KeyType: "RANGE"
                        }],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    },
                }
            },
            TagsTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: `${resourcePrefix}-tags`,
                    AttributeDefinitions: [
                        {
                            AttributeName: "pkey",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "skey",
                            AttributeType: "S",
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "pkey",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "skey",
                            KeyType: "RANGE"
                        }],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    },
                }
            },
            StatusesTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: `${resourcePrefix}-statuses`,
                    AttributeDefinitions: [
                        {
                            AttributeName: "pkey",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "skey",
                            AttributeType: "S",
                        },
                        {AttributeName: 'uri', AttributeType: 'S'},
                        {AttributeName: 'inReplyToAccountId', AttributeType: 'S'},
                        {AttributeName: 'inReplyToId', AttributeType: 'S'},
                        {AttributeName: 'conversationId', AttributeType: 'S'},
                        {AttributeName: 'accountId', AttributeType: 'S'},
                    ],
                    KeySchema: [
                        {
                            AttributeName: "pkey",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "skey",
                            KeyType: "RANGE"
                        }],
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: 'url-index',
                            KeySchema: [{AttributeName: 'uri', KeyType: 'HASH'}],
                            Projection: {ProjectionType: 'ALL'},
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                        {
                            IndexName: 'in-reply-to-account-index',
                            KeySchema: [{AttributeName: 'inReplyToAccountId', KeyType: 'HASH'}],
                            Projection: {ProjectionType: 'ALL'},
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                        {
                            IndexName: 'in-reply-to-index',
                            KeySchema: [{AttributeName: 'inReplyToId', KeyType: 'HASH'}],
                            Projection: {ProjectionType: 'ALL'},
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                        {
                            IndexName: 'conversation-index',
                            KeySchema: [{AttributeName: 'conversationId', KeyType: 'HASH'}],
                            Projection: {ProjectionType: 'ALL'},
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                        {
                            IndexName: 'account-index',
                            KeySchema: [{AttributeName: 'accountId', KeyType: 'HASH'}],
                            Projection: {ProjectionType: 'ALL'},
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 1,
                                WriteCapacityUnits: 1
                            }
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    },
                }
            },
        },
        Outputs: {
            AccountsTableArn: {
                Value: {'Fn::GetAtt': ['AccountsTable', 'Arn']},
                Export: {
                    Name: `${resourcePrefix}-AccountsTableArn`
                }
            },
            AccountsTableName: {
                Value: {Ref: 'AccountsTable'},
                Export: {
                    Name: `${resourcePrefix}-AccountsTableName`
                }
            },
            FollowsTableArn: {
                Value: {'Fn::GetAtt': ['FollowsTable', 'Arn']},
                Export: {
                    Name: `${resourcePrefix}-FollowsTableArn`
                }
            },
            FollowsTableName: {
                Value: {Ref: 'FollowsTable'},
                Export: {
                    Name: `${resourcePrefix}-FollowsTableName`
                }
            },
            TagsTableArn: {
                Value: {'Fn::GetAtt': ['TagsTable', 'Arn']},
                Export: {
                    Name: `${resourcePrefix}-TagsTableArn`
                }
            },
            TagsTableName: {
                Value: {Ref: 'TagsTable'},
                Export: {
                    Name: `${resourcePrefix}-TagsTableName`
                }
            },
            StatusesTableArn: {
                Value: {'Fn::GetAtt': ['StatusesTable', 'Arn']},
                Export: {
                    Name: `${resourcePrefix}-StatusesTableArn`
                }
            },
            StatusesTableName: {
                Value: {Ref: 'StatusesTable'},
                Export: {
                    Name: `${resourcePrefix}-StatusesTableName`
                }
            }
        }
    },
};


module.exports = serverlessConfiguration;
