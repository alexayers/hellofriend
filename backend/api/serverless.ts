import type {AWS} from '@serverless/typescript';
import {login, register} from "@functions/auth";
import configuration from "../configuration";
import {
  followAccount,
  getAccount,
  getBookmarks,
  getFavorites, getStatuses,
  unFollowAccount,
  updateAccount
} from "@functions/account";
import {exploreAccounts, explorePosts, exploreTags} from "@functions/explore";
import {search} from "@functions/search";
import {
  bookmarkStatus,
  deleteStatus,
  favoriteStatus,
  getStatus, pinStatus,
  postStatus, removeBookmark, removeFavorite,
  replyToStatus, unPinStatus,
  updateStatus
} from "@functions/status";
import {getTimeline, getTimelineByTag} from "@functions/timeline";


// We'll use this resourcePrefix for all our resources: dynamoDB, Cognito, etc
const resourcePrefix: string = configuration.resourcePrefix;

// Domain name you're using for this project
const domain: string = configuration.domain;

export const serverlessConfiguration: AWS = {
  service: 'hello-friend-api',
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
    logRetentionInDays: 3,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      COGNITO_CLIENT_ID: { "Fn::ImportValue": `${resourcePrefix}-CognitoUserPoolClientId` },
      ACCOUNTS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-AccountsTableName` },
      FOLLOWS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-FollowsTableName` },
      STATUSES_TABLE: { "Fn::ImportValue": `${resourcePrefix}-StatusesTableName` },
      TAGS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-TagsTableName` },
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
  functions: {login,
    register,
    updateAccount,
    getBookmarks,
    getFavorites,
    followAccount,
    unFollowAccount,
    getAccount,
    getStatuses,
    explorePosts,
    exploreTags,
    exploreAccounts,
    search,
    postStatus,
    getStatus,
    updateStatus,
    deleteStatus,
    replyToStatus,
    favoriteStatus,
    removeFavorite,
    bookmarkStatus,
    removeBookmark,
    pinStatus,
    unPinStatus,
    getTimeline,
    getTimelineByTag
  },
  package: {individually: true},
  custom: {
    certificateName: `${domain}`,
    customDomain: {
      domainName: `api.${domain}`,
      basePath: 'public',
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
      CognitoUserPoolAuthorizer: {
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
          Name: `${resourcePrefix}-cognito-authorizer`,
          Type: 'COGNITO_USER_POOLS',
          IdentitySource: 'method.request.header.Authorization',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
          ProviderARNs: [
            { "Fn::ImportValue": `${resourcePrefix}-CognitoUserPoolArn` }
          ],
        },
      },
    }
  },
};


module.exports = serverlessConfiguration;
