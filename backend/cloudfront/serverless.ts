import type {AWS} from '@serverless/typescript';
import configuration from "../configuration";

// Domain name you're using for this project
const domain: string = configuration.domain;

const certificateID: string = configuration.certificateID;

export const serverlessConfiguration: AWS = {
    service: 'hello-friend-cloudfront',
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
               CLOUDFRONT
           -=-=-=-=-=-=-=-=-=-=-=-
          */

            // Files

            CloudFrontFilesDistribution: {
                Type: 'AWS::CloudFront::Distribution',
                Properties: {
                    DistributionConfig: {
                        Origins: [{
                            DomainName: `files.${domain}.s3-website-us-east-1.amazonaws.com`,
                            Id: 'S3-Website-Origin',
                            CustomOriginConfig: {
                                OriginProtocolPolicy: 'http-only',
                                HTTPPort: 80,
                                HTTPSPort: 443
                            }
                        }],
                        Enabled: true,
                        DefaultRootObject: 'index.html',
                        Aliases: [`files.${domain}`],
                        DefaultCacheBehavior: {
                            TargetOriginId: 'S3-Website-Origin',
                            ViewerProtocolPolicy: 'redirect-to-https',
                            AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                            CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6', // ID for "CachingOptimized"
                            OriginRequestPolicyId: '216adef6-5c7f-47e4-b989-5492eafa07d3', // ID for "AllViewer"
                        },
                        CustomErrorResponses: [{
                            ErrorCode: 404,
                            ResponseCode: 404,
                            ResponsePagePath: '/error.html'
                        }],
                        ViewerCertificate: {
                            AcmCertificateArn: {
                                'Fn::Join': [
                                    '', [
                                        'arn:aws:acm:us-east-1:',
                                        {'Ref': 'AWS::AccountId'},
                                        ':certificate/',
                                        `${certificateID}`
                                    ]
                                ],
                            },
                            SslSupportMethod: 'sni-only',
                            MinimumProtocolVersion: 'TLSv1.2_2019',

                        }
                    }
                }
            },

            CloudFrontWebSiteDistribution: {
                Type: 'AWS::CloudFront::Distribution',
                Properties: {
                    DistributionConfig: {
                        Origins: [{
                            DomainName: `www.${domain}.s3-website-us-east-1.amazonaws.com`,
                            Id: 'S3-Website-Origin',
                            CustomOriginConfig: {
                                OriginProtocolPolicy: 'http-only',
                                HTTPPort: 80,
                                HTTPSPort: 443
                            }
                        }],
                        Enabled: true,
                        DefaultRootObject: 'index.html',
                        Aliases: [`www.${domain}`, `${domain}`],
                        DefaultCacheBehavior: {
                            TargetOriginId: 'S3-Website-Origin',
                            ViewerProtocolPolicy: 'redirect-to-https',
                            AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                            CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6', // ID for "CachingOptimized"
                            OriginRequestPolicyId: '216adef6-5c7f-47e4-b989-5492eafa07d3', // ID for "AllViewer"
                            FunctionAssociations: [
                                {
                                    EventType: 'viewer-request',
                                    FunctionARN: {
                                        'Fn::Sub': 'arn:aws:cloudfront::${AWS::AccountId}:function/RedirectWebFingerFunction'
                                    },
                                },
                            ],
                        },
                        CustomErrorResponses: [{
                            ErrorCode: 404,
                            ResponseCode: 404,
                            ResponsePagePath: '/error.html'
                        }],
                        ViewerCertificate: {
                            AcmCertificateArn: {
                                'Fn::Join': [
                                    '', [
                                        'arn:aws:acm:us-east-1:',
                                        {'Ref': 'AWS::AccountId'},
                                        ':certificate/',
                                        `${certificateID}`
                                    ]
                                ],
                            },
                            SslSupportMethod: 'sni-only',
                            MinimumProtocolVersion: 'TLSv1.2_2019',

                        }
                    }
                }
            },

            /*
            -=-=-=-=-=-=-=-=-=-=-=-
                 ROUTE 53
            -=-=-=-=-=-=-=-=-=-=-=-
           */

            // Uploaded Data

            Route53RFilesRecordSet: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    HostedZoneName: `${domain}.`,
                    Name: `files.${domain}.`,
                    Type: 'A',
                    AliasTarget: {
                        HostedZoneId: 'Z2FDTNDATAQYW2',
                        DNSName: {
                            'Fn::GetAtt': ['CloudFrontFilesDistribution', 'DomainName'],
                        },
                    },
                }
            },

            Route53WebSiteRecordSet: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    HostedZoneName: `${domain}.`,
                    Name: `www.${domain}.`,
                    Type: 'A',
                    AliasTarget: {
                        HostedZoneId: 'Z2FDTNDATAQYW2',
                        DNSName: {
                            'Fn::GetAtt': ['CloudFrontWebSiteDistribution', 'DomainName'],
                        },
                    },
                }
            },

            Route53WebSiteNoWWWRecordSet: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    HostedZoneName: `${domain}.`,
                    Name: `${domain}.`,
                    Type: 'A',
                    AliasTarget: {
                        HostedZoneId: 'Z2FDTNDATAQYW2',
                        DNSName: {
                            'Fn::GetAtt': ['CloudFrontWebSiteDistribution', 'DomainName'],
                        },
                    },
                }
            },
        }
    },
};


module.exports = serverlessConfiguration;
