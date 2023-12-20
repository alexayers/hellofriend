import type {AWS} from '@serverless/typescript';
import {webFinger, webFingerRemote} from "@functions/finger";
import {getUser, postPersonalInbox} from "@functions/user";
import configuration from "../configuration";
import {postSharedInbox} from "@functions/inbox";
import {inboundQueueProcessor} from "src/functions/inboundQueue";
import {outboundQueueProcessor} from "@functions/outboundQueue";


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
        logs: {
            lambda: {
                retentionInDays: 3
            }
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            COGNITO_CLIENT_ID: { "Fn::ImportValue": `${resourcePrefix}-CognitoUserPoolClientId` },
            ACCOUNTS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-AccountsTableName` },
            FOLLOWS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-FollowsTableName` },
            STATUSES_TABLE: { "Fn::ImportValue": `${resourcePrefix}-StatusesTableName` },
            TAGS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-TagsTableName` },
            DOMAIN: '${self:custom.certificateName}',
            INBOUND_QUEUE: { 'Fn::ImportValue': `${resourcePrefix}-InboundQueueUrl` },
            OUTBOUND_QUEUE: { 'Fn::ImportValue': `${resourcePrefix}-OutboundQueueUrl` },
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
                        Effect: 'Allow',
                        Action: [
                            'sqs:SendMessage'
                        ],
                        Resource: [
                            { "Fn::ImportValue": {"Fn::Sub": `${resourcePrefix}-InboundQueueArn`} },
                            { "Fn::ImportValue": {"Fn::Sub": `${resourcePrefix}-OutboundQueueArn`} }
                        ]
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
                            { "Fn::ImportValue": `${resourcePrefix}-StatusesTableArn` },
                            { "Fn::Join": ['', [
                                    { "Fn::ImportValue": `${resourcePrefix}-StatusesTableArn` },
                                    '/index/*'
                                ]]
                            },
                            { "Fn::ImportValue": `${resourcePrefix}-FollowsTableArn` },
                            { "Fn::Join": ['', [
                                    { "Fn::ImportValue": `${resourcePrefix}-FollowsTableArn` },
                                    '/index/*'
                                ]]
                            },
                            { "Fn::ImportValue": `${resourcePrefix}-TagsTableArn` },
                            { "Fn::Join": ['', [
                                    { "Fn::ImportValue": `${resourcePrefix}-TagsTableArn` },
                                    '/index/*'
                                ]]
                            },
                        ]
                    }],
            },
        }
    },
    // import the function via paths
    functions: {webFinger, getUser, webFingerRemote, postSharedInbox, postPersonalInbox, inboundQueueProcessor, outboundQueueProcessor},
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
