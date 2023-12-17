# HelloFriend: A Serverless Implementation of ActivityPub

This project must be deployed before the client project.

### Prerequisites

1. Completed the deployment of the **infra** project

### First Time setup

**Note:** It might take a few minutes until your API's respond to your custom domain mapping.

1. Run `npm i` to install your dependencies
2. Run `npm run deploy` to deploy the stack

### Updates

1. Run `npm run deploy` to update the stack as needed

### Teardown

1. Manually disassociate the Cloudfront Function from the WWW cloudfront distribution.
2. Run `npm run teardown` to destroy all resources if you skip the prior steps the teardown will probably partially succeed

### AWS Services

This will make use of the following AWS Services 

- Route53
- CloudFront
- Cloudformation
- S3
- SQS
- CloudWatch
- DynamoDB
- API Gateway
- Lambda
- Cognito
- IAM
- Certificate Manager
