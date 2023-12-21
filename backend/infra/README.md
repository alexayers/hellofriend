# Hello Friend: Infrastructure

This project will setup the follow prerequisites.

- API Custom Domain api.example.com
- Cognito User Pool and Cognito Client
- CloudFront Function
- S3 Buckets
- SQS Queues

### Prerequisites

1. Register a domain through AWS Route 53
2. Register a certificate through ACM Certificate manager and make note of the Certificate ID

### Setup

1. Copy configuration.sample.ts to configuration.ts, and update the values to your setup.
2. Run `npm i` to install your dependencies
3. Run `npm run deploy:domain` to setup the custom domain records in route53. You'll see a warning which can be ignored.
4. Run `npm run deploy` to deploy the stack


### Known Issues

**Issue 1**
You can ignore this failure on deployments:
Error: Failed to find a stack hello-friend-infra-dev
