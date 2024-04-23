#!/bin/bash

echo "=============================== Deploying to kubernetes ... ==============================="

##### Environment #####
echo "---------- Setting environment variables from the environment files ... ----------"
bash "$(dirname "$0")/generate-env-generated-file.sh"

# Additional environment variables
GIT_COMMIT_HASH=$(git rev-parse HEAD)
echo "GIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> .env.generated

echo "---------- Exporting environment variables ... ----------"
export $(xargs < .env.generated)

##### Minikube #####
echo "---------- Configuring Minikube Docker environment ... ----------"
eval $(minikube docker-env)

##### Building Docker Images ######
echo "---------- Building Docker Images ... ----------"
docker build -t moaitime/moaitime-web:latest -f ./apps/web/Dockerfile .
docker build -t moaitime/moaitime-api:latest -f ./apps/api/Dockerfile .
docker build -t moaitime/moaitime-cli:latest -f ./apps/cli/Dockerfile .

##### Deployment #####
echo "---------- Deploy to Kubernetes ... ----------"
kubectl apply -f ./k8s
