#!/bin/bash

echo "=============================== Deploying to docker swarm ... ==============================="

##### Environment #####
echo "---------- Setting environment variables from the environment files ... ----------"
bash "$(dirname "$0")/generate-env-generated-file.sh"

# Additional environment variables
GIT_COMMIT_HASH=$(git rev-parse HEAD)
echo "GIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> .env.generated

echo "---------- Exporting environment variables ... ----------"
export $(xargs < .env.generated)

##### Building Docker Images ######
echo "---------- Building Docker Images ... ----------"
docker build -t moaitime/moaitime-web:latest -f ./apps/web/Dockerfile .
docker build -t moaitime/moaitime-api:latest -f ./apps/api/Dockerfile .
docker build -t moaitime/moaitime-cli:latest -f ./apps/cli/Dockerfile .

##### Deployment ######
echo "---------- Deploy to Docker Swarm ... ----------"
docker stack deploy --compose-file ./docker/compose.yaml --compose-file ./docker/compose.deployment.yaml --compose-file ./docker/compose.apps.yaml --compose-file ./docker/compose.swarm.yaml moaitime
