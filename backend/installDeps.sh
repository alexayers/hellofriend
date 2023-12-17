#!/bin/sh

echo "Installing dependencies..."

echo "Installing Shared-Lib dependencies..."
cd shared-lib
npm i
cd ..
echo "Installing Activity-Pub dependencies..."
cd activity-pub
npm i
cd ..
echo "Installing API dependencies..."
cd api
npm i
cd ..
echo "Installing CloudFront dependencies..."
cd cloudfront
npm i
cd ..
echo "Installing Database dependencies..."
cd database
npm i
cd ..
echo "Installing Infra dependencies..."
cd infra
npm i

echo "All done!"
