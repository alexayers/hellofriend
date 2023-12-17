# Hello Friend: Cloudfront Project

This project will setup the follow prerequisites.

- CloudFront
- Route 53 records pointing to CloudFront

### Prerequisites

1. Register a domain through AWS Route 53
2. Register a certificate through ACM Certificate manager and make note of the Certificate ID

### Setup

1. Run `npm i` to install your dependencies
2. Run `npm run deploy` to deploy the stack

Cloudfront will take awhile to deploy, so don't be surprised if this takes a few minutes longer than other stacks.

### Known Issues

**Issue 1**
If you see an error like:
Error: ENOENT: no such file or directory, lstat '/Users/<user>/github/hellofriend/backend/cloudfront/.esbuild/.serverless'

You can just create it, and it will stop complaining.
