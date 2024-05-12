# MoaiTime - Deploy to Docker Compose

Let's go through the steps to deploy MoaiTime to Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker)
- [Resend](https://resend.com) account or a SMTP account

## Steps

### 1. Clone the repository

Let's start by cloning the repository:

```bash
git clone git@github.com/bobalazek/moaitime.git
```

### 2. Prepare environment variables

Now we will need to prepare the environment variables:

```bash
cp .env.local.example .env.local
```

After that, you'll need to either create a [Resend](https://resend.com/) account or a SMTP account to send emails. Then set the following environment variables:

```bash
MAILER_FROM="MoaiTime Mailer <noreply@mydomain.com>"

# IMPORTANT NOTE - if the username of password have special characters, YOU MUST ENCODE THEM! Use a tool like https://www.urlencoder.org
MAILER_SMTP_URL=smtp://user:password@mydomain.com:587
# OR
MAILER_RESEND_API_KEY=re_123412341234 # You can get this from Resend
```

You can either set the `MAILER_SMTP_URL` or the `MAILER_RESEND_API_KEY`, but not both. Priority is given to the `MAILER_RESEND_API_KEY`.

### 3. Deploy to Docker Compose

```bash
./scripts/deploy-to-docker-compose.sh
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

### 5. Access and enjoy MoaiTime

You can now access MoaiTime at [http://localhost:4200](http://localhost:4200). The default credentials are - email: `admin@moaitime.com`, password: `password`

### 6. Enjoy MoaiTime

This is where we reached the end of the installation process. You can now enjoy MoaiTime!
