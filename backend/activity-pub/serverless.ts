import type {AWS} from '@serverless/typescript';
import {webFinger, webFingerRemote} from "@functions/finger";
import {getUser} from "@functions/user";
import configuration from "../configuration";


// We'll use this resourcePrefix for all our resources: dynamoDB, Cognito, etc
const resourcePrefix: string = configuration.resourcePrefix;

// Domain name you're using for this project
const domain: string = configuration.domain;

export const serverlessConfiguration: AWS = {
    service: 'hello-friend-activity-pub',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local', 'serverless-domain-manager'],
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
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            COGNITO_CLIENT_ID: { "Fn::ImportValue": `${resourcePrefix}-CognitoUserPoolClientId` },
            ACCOUNTS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-AccountsTableName` },
            DOMAIN: '${self:custom.certificateName}'
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: [
                            's3:GetBucketPolicy',
                            's3:ListBucket',
                            's3:DeleteBucket',
                            's3:PutObject',
                            's3:GetObject',
                            's3:DeleteObject'
                        ],
                        Resource: [
                            `arn:aws:s3:::files.${domain}`,
                            `arn:aws:s3:::files.${domain}/*`,
                        ],
                    },
                    {
                        Effect: "Allow",
                        Action: [
                            "dynamodb:DescribeTable",
                            "dynamodb:Query",
                            "dynamodb:Scan",
                            "dynamodb:GetItem",
                            "dynamodb:PutItem",
                            "dynamodb:UpdateItem",
                            "dynamodb:DeleteItem",
                        ],
                        Resource: [
                            { "Fn::ImportValue": `${resourcePrefix}-AccountsTableArn` },
                            { "Fn::Join": ['', [
                                    { "Fn::ImportValue": `${resourcePrefix}-AccountsTableArn` },
                                    '/index/*'
                                ]]
                            },
                        ]
                    }],
            },
        }
    },
    // import the function via paths
    functions: {webFinger, getUser, webFingerRemote},
    package: {individually: true},
    custom: {
        certificateName: `${domain}`,
        customDomain: {
            domainName: `api.${domain}`,
            basePath: 'activitypub',
            stage: '${self:provider.stage}',
            createRoute53Record: false,
            certificateName: '${self:custom.certificateName}',
        },
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
        dynamodb: {
            start: {
                port: 5000,
                inMemory: true,
                migrate: true,
            },
            stages: "dev"
        }
    },
    resources: {
        Resources: {
        }
    },
};


module.exports = serverlessConfiguration;
