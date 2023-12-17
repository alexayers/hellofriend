# Hello Friend Backend

There are two stacks that will need to be deployed.

1. infra: This must be deployed first and will setup a bunch of our infrastructure.
2. cloudfront: This must be deployed second and will setup the cloudfront distributions
3. database: This will be setup third. It contains our database configuration
4. activity-pub: This contains our implementation of ActivityPub
5. api: This contains are public facing APIs.

### Quickly install dependencies

You can quickly install your dependencies by running the script

`./backend/installDeps.sh`

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
