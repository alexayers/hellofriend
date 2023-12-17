# Hello Friend: Database

This project will setup the follow prerequisites.

- DynamoDB Database

### Setup

1. Copy configuration.sample.ts to configuration.ts, and update the values to your setup.
2. Run `npm i` to install your dependencies
3. Run `npm run deploy` to deploy the stack

### Known Issues

**Issue 1**
If you see an error like:
Error: ENOENT: no such file or directory, lstat '/Users/<user>/github/hellofriend/backend/database/.esbuild/.serverless'

You can just create it, and it will stop complaining.
