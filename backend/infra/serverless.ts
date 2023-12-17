import type {AWS} from '@serverless/typescript';
import configuration from "../configuration";

// We'll use this resourcePrefix for all our resources: dynamoDB, Cognito, etc
const resourcePrefix: string = configuration.resourcePrefix;

// Domain name you're using for this project
const domain: string = configuration.domain;

// @ts-ignore
// @ts-ignore
export const serverlessConfiguration: AWS = {
    service: 'hello-friend-infra',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-domain-manager'],
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
            COGNITO_CLIENT_ID: {'Fn::GetAtt': ['CognitoUserPoolClient', 'ClientId']},
        },
    },
    package: {individually: true},
    custom: {
        certificateName: `${domain}`,
        customDomain: {
            domainName: `api.${domain}`,
            stage: '${self:provider.stage}',
            createRoute53Record: true,
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
    },
    resources: {
        Resources: {

            RedirectWebFingerFunction: {
                Type: 'AWS::CloudFront::Function',
                Properties: {
                    Name: 'RedirectWebFingerFunction',
                    AutoPublish: true,
                    FunctionConfig: {
                        Comment: 'Redirect /.well-known/webfinger requests',
                        Runtime: 'cloudfront-js-2.0'
                    },
                    FunctionCode: `
                        function handler(event) {
                            let request = event.request;
                            let uri = request.uri;
                            let querystring = request.querystring;
                        
                            if (uri.startsWith('/.well-known/webfinger')) {
                                let redirectUrl = 'https://api.${domain}/activitypub/webfinger/';
                                let username = '';
                        
                                for (var key in event.request.querystring) {
                                    
                                    if (key === "resource") {
                                        let tokens = event.request.querystring[key].value.split("acct:");
                                        let userTokens= tokens[1].split("@");
                                        redirectUrl += userTokens[0];
                                    }
                                }
                                
                                return {
                                    statusCode: 302,
                                    statusDescription: 'Found',
                                    headers: {
                                        'location': { value: redirectUrl }
                                    }
                                };
                            } else if (uri.startsWith('/users')) {
                                let pathTokens = uri.split("/");
                                let redirectUrl = 'https://api.${domain}/activitypub/users/' + pathTokens[pathTokens.length-1];
                                
                                return {
                                    statusCode: 302,
                                    statusDescription: 'Found',
                                    headers: {
                                        'location': { value: redirectUrl }
                                    }
                                };
                            }
                        
                            return request;
                        }
                      `
                }
            },

            /*
           -=-=-=-=-=-=-=-=-=-=-=-
               COGNITO
           -=-=-=-=-=-=-=-=-=-=-=-
           */

            CognitoUserPool: {
                Type: 'AWS::Cognito::UserPool',
                Properties: {
                    UserPoolName: `${resourcePrefix}-user-pool-name`
                },
            },
            CognitoUserPoolClient: {
                Type: 'AWS::Cognito::UserPoolClient',
                Properties: {
                    ClientName: `${resourcePrefix}-user-pool-client-name`,
                    UserPoolId: {
                        Ref: 'CognitoUserPool',
                    },
                    ExplicitAuthFlows: ['USER_PASSWORD_AUTH'],
                    GenerateSecret: false,
                },
            },

            /*
            -=-=-=-=-=-=-=-=-=-=-=-
                S3
            -=-=-=-=-=-=-=-=-=-=-=-
            */

            // Uploaded data

            FilesBucket: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: `files.${domain}`,
                    WebsiteConfiguration: {
                        IndexDocument: 'index.html',
                        ErrorDocument: 'error.html'
                    },
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: false,
                        IgnorePublicAcls: false,
                        BlockPublicPolicy: false,
                        RestrictPublicBuckets: false
                    },
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                AllowedHeaders: ['*'],
                                AllowedMethods: ['GET'],
                                AllowedOrigins: ['*']
                            },
                        ],
                    },
                }
            },
            FilesBucketPolicy: {
                Type: 'AWS::S3::BucketPolicy',
                Properties: {
                    Bucket: {
                        Ref: 'FilesBucket',
                    },
                    PolicyDocument: {
                        Version: "2008-10-17",
                        Id: "PolicyForPublicWebsiteContent",
                        Statement: [
                            {
                                Sid: "PublicReadGetObject",
                                Action: ['s3:GetObject'],
                                Effect: 'Allow',
                                Resource: `arn:aws:s3:::files.${domain}/*`,
                                Principal: '*',
                            },
                        ],
                    },
                },
            },

            // Our Website

            WebsiteBucket: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: `www.${domain}`,
                    WebsiteConfiguration: {
                        IndexDocument: 'index.html',
                        ErrorDocument: 'error.html'
                    },
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: false,
                        IgnorePublicAcls: false,
                        BlockPublicPolicy: false,
                        RestrictPublicBuckets: false
                    },
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                AllowedHeaders: ['*'],
                                AllowedMethods: ['GET'],
                                AllowedOrigins: ['*']
                            },
                        ],
                    },
                }
            },
            WebsiteBucketPolicy: {
                Type: 'AWS::S3::BucketPolicy',
                Properties: {
                    Bucket: {
                        Ref: 'WebsiteBucket',
                    },
                    PolicyDocument: {
                        Version: "2008-10-17",
                        Id: "PolicyForPublicWebsiteContent",
                        Statement: [
                            {
                                Sid: "PublicReadGetObject",
                                Action: ['s3:GetObject'],
                                Effect: 'Allow',
                                Resource: `arn:aws:s3:::www.${domain}/*`,
                                Principal: '*',
                            },
                        ],
                    },
                },
            },

            /*
            -=-=-=-=-=-=-=-=-=-=-=-=-=-
                    SQS
            -=-=-=-=-=-=-=-=-=-=-=-=-=-
             */

            PostQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: `${resourcePrefix}-post-queue`,
                },
            },
            ActivityQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: `${resourcePrefix}-activity-queue`
                },
            },
        },
        Outputs: {
            CognitoUserPoolClientId: {
                Value: { "Fn::GetAtt": ["CognitoUserPoolClient", "ClientId"] },
                Export: {
                    Name: `${resourcePrefix}-CognitoUserPoolClientId`
                }
            }
        }
    },
};


module.exports = serverlessConfiguration;
