#!/bin/bash

echo "=============================== Deploying to docker swarm ... ==============================="

##### Environment #####
echo "---------- Setting environment variables from the environment files ... ----------"
bash "$(dirname "$0")/generate-env-generated-file.sh"

# Additional environment variables
GIT_COMMIT_HASH=$(git rev-parse HEAD)
echo "GIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> .env.generated

echo "---------- Exporting environment variables ... ----------"
# Some of our docker compose files (compose.swarm.yaml)
# use variables specified in .env.generated file,
# so we need to export them before running docker stack deploy.
export $(xargs < .env.generated)

#### Docker #####
echo "---------- Pulling docker images ... ----------"
docker build -t moaitime/moaitime-web:latest -f ./apps/web/Dockerfile .
docker build -t moaitime/moaitime-api:latest -f ./apps/api/Dockerfile .
docker build -t moaitime/moaitime-cli:latest -f ./apps/cli/Dockerfile .

echo "---------- Doing deployment to docker swarm ... ----------"
docker stack deploy --compose-file ./docker/compose.yaml --compose-file ./docker/compose.deployment.yaml --compose-file ./docker/compose.apps.yaml --compose-file ./docker/compose.swarm.yaml moaitime
