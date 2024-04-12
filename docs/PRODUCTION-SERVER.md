# MoaiTime - Production Server

This is a guide on how to set up the production server.

## Setup

```sh
# SSH into the box (the -A flag is for forwarding the SSH agent)
ssh-add && ssh -A borut@192.168.1.30

########## Docker ##########
# Install docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Init swarm
sudo docker swarm init

########## Project ##########
# Add current user to the docker group
sudo usermod -aG docker $USER

# Prepare a projects directory
sudo mkdir -p /var/projects

# Change ownership of the /var/projects to docker
sudo chown :docker /var/projects

# Change permissions of the /var/projects to 775
sudo chmod 775 /var/projects

# Create a ~/projects folder linking to the original /var/projects folder
ln -s /var/projects ~/projects 2>/dev/null || true

# Exit out of the SSH session and log-in again, so the group changes take effect
exit
ssh-add && ssh -A borut@192.168.1.30

# Change directory into that new projects directory
cd /var/projects

# Clone the git repository
git clone git@github.com:bobalazek/moaitime.git

# Change docker registry in .env.local
touch .env.local
vi .env.local

##### Deployment
./scripts/deploy-to-docker-swarm.sh
```
