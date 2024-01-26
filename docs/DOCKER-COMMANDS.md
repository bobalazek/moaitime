# MoaiTime - Docker Commands

## Web

- `docker build --tag moaitime-web --file ./apps/web/Dockerfile .` - builds the web container
- `docker rm -f moaitime-web && docker run --name moaitime-web -p 4200:80 moaitime-web` - starts the web container
  - You can then go to <http://localhost:4200> (or whichever port you specified) to view the web app

## API

- `docker build --tag moaitime-api --file ./apps/api/Dockerfile .` - builds the API container
- `docker rm -f moaitime-api && docker run --name moaitime-api -p 3636:3636 moaitime-api` - starts the API container
- You can then go to <http://localhost:3636> (or whichever port you specified) to view the API