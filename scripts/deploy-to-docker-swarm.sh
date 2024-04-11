#!/bin/bash

echo "=============================== Deploying to docker swarm ... ==============================="

##### Environment #####
echo "---------- Setting environment variables from the environment files ... ----------"
bash "$(dirname "$0")/generate-env-generated-file.sh"

# Additional environment variables
GIT_COMMIT_HASH=$(git rev-parse HEAD)
echo "GIT_COMMIT_HASH=$GIT_COMMIT_HASH" >> .env.generated

# Some of our docker compose files (compose.overrides.production.yaml)
# use variables specified in .env.generated file,
# so we need to export them before running docker stack deploy.
export $(xargs < .env.generated)

#### Docker #####
echo "---------- Pulling docker images ... ----------"
echo $GITHUB_PACKAGES_TOKEN | docker login ghcr.io -u bobalazek --password-stdin
docker pull ghcr.io/bobalazek/moaitime/moaitime-api:latest
docker pull ghcr.io/bobalazek/moaitime/moaitime-cli:latest
# We need to build the image locally, because the frontend requires the environment variables,
# which are not available on build-time at the moment in GitHub actions.
#docker pull ghcr.io/bobalazek/moaitime/moaitime-web:latest
docker build -t ghcr.io/bobalazek/moaitime/moaitime-web:latest -f ./apps/web/Dockerfile .

echo "---------- Doing actual deployment to docker swarm ... ----------"
docker stack deploy --compose-file ./docker/compose.yaml --compose-file ./docker/compose.deployment.yaml --compose-file ./docker/compose.apps.yaml --compose-file ./docker/compose.overrides.production.yaml moaitime
