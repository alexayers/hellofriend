import type {AWS} from '@serverless/typescript';
import configuration from "../configuration";
import {
  dynamoDbStreamAccountsProcessor,
  dynamoDbStreamStatusesProcessor,
  dynamoDbStreamTagsProcessor
} from "src/functions/search-stream";
import {createIndices, destroyIndices} from "@functions/install";
import {searchTimeline} from "@functions/search";


// We'll use this resourcePrefix for all our resources: dynamoDB, Cognito, etc
const resourcePrefix: string = configuration.resourcePrefix;

// Domain name you're using for this project
const domain: string = configuration.domain;

export const serverlessConfiguration: AWS = {
  service: 'hello-friend-timeline',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local', 'serverless-domain-manager'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: 'dev',
    tracing: {
      lambda: true,
      apiGateway: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    logRetentionInDays: 3,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      COGNITO_CLIENT_ID: { "Fn::ImportValue": `${resourcePrefix}-CognitoUserPoolClientId` },
      OPENSEARCH_ENDPOINT: { 'Fn::ImportValue': `${resourcePrefix}-OpenSearchEndpoint` },
      FILES_BUCKET: { 'Fn::ImportValue': `${resourcePrefix}-FilesBucketName` },
      ACCOUNTS_TABLE: { "Fn::ImportValue": `${resourcePrefix}-AccountsTableName` },
      TIMESERIES_TABLE: { "Fn::ImportValue": `${resourcePrefix}-TimeSeriesTableName` },
      DOMAIN: '${self:custom.certificateName}'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
            ],
            Resource: '*',
          },
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
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem"
            ],
            Resource: [
              {"Fn::ImportValue": `${resourcePrefix}-AccountsTableArn`},
              {
                "Fn::Join": ['', [
                  {"Fn::ImportValue": `${resourcePrefix}-AccountsTableArn`},
                  '/index/*'
                ]]
              },
              {"Fn::ImportValue": `${resourcePrefix}-StatusesTableArn`},
              {
                "Fn::Join": ['', [
                  {"Fn::ImportValue": `${resourcePrefix}-StatusesTableArn`},
                  '/index/*'
                ]]
              },
              {"Fn::ImportValue": `${resourcePrefix}-TagsTableArn`},
              {
                "Fn::Join": ['', [
                  {"Fn::ImportValue": `${resourcePrefix}-TagsTableArn`},
                  '/index/*'
                ]]
              },
              { "Fn::ImportValue": `${resourcePrefix}-TimeSeriesTableArn` },
              { "Fn::Join": ['', [
                  { "Fn::ImportValue": `${resourcePrefix}-TimeSeriesTableArn` },
                  '/index/*'
                ]]
              },
            ]
          }
          ],
      },
    }
  },

  functions: {
    dynamoDbStreamStatusesProcessor,
    dynamoDbStreamTagsProcessor,
    dynamoDbStreamAccountsProcessor,
    createIndices,
    destroyIndices,
    searchTimeline
  },
  package: {individually: true},
  custom: {
    certificateName: `${domain}`,
    customDomain: {
      domainName: `api.${domain}`,
      basePath: 'timeline',
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
