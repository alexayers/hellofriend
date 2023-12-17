# HelloFriend

### PreReqs

**Note:** You must deploy the backend first because it creates the bucket required for this deployment.

You'll need to update a handful of files for your environment. I'll automate this later, but for now just
update it by hand. 

1. proxy.conf.json should point at your files.<domain>
2. scripts/deploy.sh should point to you www.<domain>
3. src/environments.* should point to your www.<domain> and your api.<domain>

### Build

1. `npm run build`

### Deploy

Note: You'll need to have set your AWS environment variables for this to succeed.

1. `npm run deploy` (This will both build and deploy to your S3 bucket)
