#!/bin/bash

echo "=============================== Deploying to docker compose ... ==============================="

##### Environment #####
echo "---------- Setting environment variables from the environment files ... ----------"
bash "$(dirname "$0")/generate-env-generated-file.sh"

# Additional environment variables
GIT_COMMIT_HASH=$(git rev-parse HEAD)
echo "GIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> .env.generated

echo "---------- Exporting environment variables ... ----------"
export $(xargs < .env.generated)

#### Deployment #####
echo "---------- Deploy to Docker Compose ... ----------"
docker compose --file ./docker/compose.yaml --file ./docker/compose.apps.yaml --env-file ./.env.generated up --detach
