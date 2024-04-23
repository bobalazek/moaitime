# MoaiTime - Deploy to Kubernetes

Let's go through the steps to deploy MoaiTime to your Kubernetes cluster.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker)
- [Resend](https://resend.com) account or a SMTP account
- [minikube](https://minikube.sigs.k8s.io/docs/start/)

## Steps

### 1. Clone the repository and prepare environment variables

The steps are exactly the same as for the Docker Compose deployment, so please follow the steps from the [DEPLOY-TO-DOCKER-COMPOSE.md](./DEPLOY-TO-DOCKER-COMPOSE.md) file.

### 2. Deploy to Kubernetes

```bash
# In case you are using minikube, you can use the following alias to run kubectl commands:
alias kubectl="minikube kubectl --"

./scripts/deploy-to-kubernetes.sh
```

### 3. Setup the database

After all the services had been deployed, let's first check that all of the services are working as expected:

```bash
kubectl get pods --namespace moaitime | grep -F moaitime-cli

# Example output:
# moaitime-cli-668f45457-bc4sl                      1/1     Running   0             94s
# moaitime-cli-jobs-runner-start-595db5cbc4-5lgjg   1/1     Running   2 (86s ago)   94s
```

Then after we have the ID, we check that all of the services are working as expected:

```bash
kubectl exec -it --namespace moaitime moaitime-cli-668f45457-bc4sl -- ./cli health:check
```

Now we can run the database reload command to create the database schema, run the migrations, insert the seed data and insert the fixture data:

```bash
kubectl exec -it --namespace moaitime moaitime-cli-668f45457-bc4sl -- ./cli database:reload
```

### 4. Start Tunnel

If tou are using minikube, you can start a tunnel to access the MoaiTime application:

```bash
minikuube tunnel
```

### 5. Access MoaiTime

You can now access MoaiTime at [http://localhost:4200](http://localhost:4200). The default credentials are - email: `admin@moaitime.com`, password: `password`

### 6. Enjoy MoaiTime

This is where we reached the end of the installation process. You can now enjoy MoaiTime!
