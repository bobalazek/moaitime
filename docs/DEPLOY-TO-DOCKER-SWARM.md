# MoaiTime - Deploy to Docker Swarm

Let's go through the steps to deploy MoaiTime to your Docker Swarm cluster.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker)
- [Resend](https://resend.com) account or a SMTP account

## Steps

### 1. Clone the repository and prepare environment variables

The steps are exactly the same as for the Docker Compose deployment, so please follow the steps from the [DEPLOY-TO-DOCKER-COMPOSE.md](./DEPLOY-TO-DOCKER-COMPOSE.md) file.

### 2. Deploy to Docker Swarm

```bash
# In case your docker swarm cluster is not yet initialized, you can do so with the following command:
docker swarm init

./scripts/deploy-to-docker-swarm.sh
```

### 3. Setup the database

After all the services had been deployed, we will first need to find the perpetually running CLI container.

```bash
docker ps -a | grep -F moaitime_moaitime-cli.

# Example output:
# ee752e6ea743   moaitime/moaitime-cli:latest   "tail -f /dev/null"   46 hours ago   Up 46 hours (healthy)   moaitime_moaitime-cli.1.srj4nxdyehe19koy15586cc2v
```

Then after we have the ID, we check that all of the services are working as expected:

```bash
docker exec -it ee752e6ea743 ./cli health:check # of course you will need to replace the ID with the one you got from the previous command
```

Now we can run the database reload command to create the database schema, run the migrations, insert the seed data and insert the fixture data:

```bash
docker exec -it ee752e6ea743 ./cli database:reload
```

### 4. Access MoaiTime

You can now access MoaiTime at [http://localhost:4200](http://localhost:4200). The default credentials are - email: `admin@moaitime.com`, password: `password`

### 5. Enjoy MoaiTime

This is where we reached the end of the installation process. You can now enjoy MoaiTime!
