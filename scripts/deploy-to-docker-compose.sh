#!/bin/bash

echo "=============================== Deploying to docker compose ... ==============================="

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
echo "---------- Doing deployment to docker compose ... ----------"
docker compose --file ./docker/compose.yaml --file ./docker/compose.apps.yaml up -d
