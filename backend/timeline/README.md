# HelloFriend: Timeline

This project must be deployed before the client project.

### Prerequisites

1. Completed the deployment of the following project:
    2. infra
    3. database
    4. cloudfront

### First Time setup

**Note:** It might take a few minutes until your API's respond to your custom domain mapping.

1. Run `npm i` to install your dependencies
2. Run `npm run deploy` to deploy the stack

### Updates

1. Run `npm run deploy` to update the stack as needed

### Teardown

1. Run `npm run teardown` to destroy all resources if you skip the prior steps the teardown will probably partially succeed


### Known Issues

**Issue 1**
If you see an error like:
Error: ENOENT: no such file or directory, lstat '/Users/<user>/github/hellofriend/backend/api/.esbuild/.serverless'

You can just create it, and it will stop complaining.
