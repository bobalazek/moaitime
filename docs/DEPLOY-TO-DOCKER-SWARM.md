# MoaiTime - Deploy to Docker Swarm

Let's go through the steps to deploy MoaiTime to yout Docker Swarm cluster.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker)
- [Resend](https://resend.com) account or a SMTP account

## Steps

### 1. Clone the repository and prepare environment variables

The steps are exactly the same as for the Docker Compose deployment, so please follow the steps from the [DEPLOY-TO-DOCKER-COMPOSE.md](./DEPLOY-TO-DOCKER-COMPOSE.md) file.

### 2. Initialize the Docker Swarm

In cas your swarm cluster is not initialized yet, you can do so by running the following command:

```bash
docker swarm init
```

If it is, then you can skip this step.

### 3. Deploy to Docker Swarm

```bash
./scripts/deploy-to-docker-swarm.sh
```

### 4. Setup the database

After all the services had been deployed, let's first check that all of the services are working as expected:

```bash
docker exec -it moaitime_cli ./cli health:check
```

Now we can run the database reload command to create the database schema, run the migrations, insert the seed data and insert the fixture data:

```bash
docker exec -it moaitime_cli ./cli database:reload
```

### 5. Access MoaiTime

You can now access MoaiTime at [http://localhost:4200](http://localhost:4200). The default credentials are - email: `àdmin@moaitime.com`, password: `password`

### 6. Enjoy MoaiTime

This is where we reached the end of the installation process. You can now enjoy MoaiTime!
