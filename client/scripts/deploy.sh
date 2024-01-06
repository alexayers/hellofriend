#!/bin/sh

BUCKET_NAME=www.hellofriend.social
BUILD_DIRECTORY="dist/hellofriend/browser"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null
then
    echo "AWS CLI could not be found. Please install it and run this script again."
    exit
fi

# Sync the build directory to the S3 bucket
echo "Uploading build artifacts to S3 bucket: $BUCKET_NAME"
aws s3 sync $BUILD_DIRECTORY s3://$BUCKET_NAME --delete

# Check if the upload was successful
if [ $? -eq 0 ]; then
    echo "Upload successful."
else
    echo "Upload failed."
fi
