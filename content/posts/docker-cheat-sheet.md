---
title: "Docker CLI Cheat Sheet"
subtitle: "Streamline Your Docker Workflow: A Comprehensive CLI Cheat Sheet for Developers"
date: 2021-10-13T00:00:35+03:00
tags: [ "docker", "bash" ]
keywords: [ "docker", "cli", "bash", "containers" ]
draft: false
featured: true
---

This Docker CLI cheat sheet is a comprehensive guide to the essential commands for working with Docker containers and images. While it covers most of the common use cases, some edge cases may require additional information, so it's always a good idea to refer to the official [Docker documentation](https://docs.docker.com/).

<!--more-->

## TL;DR

```console
$ docker build -t my-image .                           # Create image using this directory's Dockerfile

$ docker run -p 4200:80 my-image                       # Run "my-image" mapping port 4200 to 80
$ docker run -d -p 4200:80 my-image                    # Same thing, but in detached mode
$ docker run username/repository:tag                   # Run image from a registry

$ docker image ls -a                                   # List all images on this machine
$ docker image rm <image id>                           # Remove specified image from this machine
$ docker image rm $(docker image ls -a -q)             # Remove all images from this machine

$ docker container ls                                  # List all running containers
$ docker container ls -a                               # List all containers, even those not running
$ docker container stop <hash>                         # Gracefully stop the specified container
$ docker container kill <hash>                         # Force shutdown of the specified container
$ docker container rm <hash>                           # Remove specified container from this machine
$ docker container rm $(docker container ls -a -q)     # Remove all containers

$ docker login                                         # Log in this CLI session using your Docker credentials
$ docker tag <image> username/repository:tag           # Tag <image> for upload to registry
$ docker push username/repository:tag                  # Upload tagged image to registry

$ docker system prune                                  # Remove all unused containers, networks and images.
```

## Build

### Build an image from a `Dockerfile`

To build an image using a `Dockerfile`, you can use the `docker build` command. By default, it uses the `Dockerfile` located in the current directory and the current directory as the build context:

```console
$ docker build -t my-image .
```

To use a different `Dockerfile`, you can use the `-f` or `--file` option followed by the path to the `Dockerfile`:

```console
$ docker build -f Dockerfile.dev -t my-image .
```

This command will create a image using this directory's `Dockerfile.dev` and the current directory as the context.

Other useful options include:

Option          | Description
--------------- | ------------------------------------------------------
`--file`, `-f`  | Name of the Dockerfile (Default is `PATH/Dockerfile`).
`--tag`, `-t`   | Name and optionally a tag in the "name:tag" format.

## Run

### Run an image

To run an image, use the following command:

```console
docker run -p 4200:80 my-image
```

This command will run "my-image" mapping port 4200 on the host machine to 80 from the container.

To run the container in detached mode, use the `-d` or `--detach` option:

```console
docker run --detach -p 4200:80 my-image
```

This command will run the container in the background and print its container ID.

Other useful options include:

Option                                  | Description
--------------------------------------- | -------------------------------------
`--detach , -d`                         | Run container in background and print container ID.
`--publish , -p HOSTPORT:CONTAINERPORT` | Publish a container’s port(s) to the host

### Run an image from a registry

To run an image from a registry, use the following command:

```console
docker run username/repository:tag
```

Replace `username` with the username associated with the repository, `repository` with the name of the repository, and `tag` with the version tag you want to use. This command will pull the image from the registry if it's not already available locally and start a container from it.

### Run a command on an image

To run a specific command on a container started from an image, use the following command:

```console
docker run my-image <command>
```

This command will run the `<command>` on a container started from "my-image".

To start an interactive shell inside a container, you can use the following command:

```console
docker run -it my-image /bin/bash
```

This command will start a new bash session on a container started from "my-image". The `-it` option is used to allocate a pseudo-TTY and keep STDIN open, and `/bin/bash` is the command that will be executed inside the container.

Other useful options include:

Option                | Description
--------------------- | -------------------------------------
`--interactive`, `-i` | Keep STDIN open even if not attached.
`--tty`, `-t`         | Allocate a pseudo-TTY.

### Run a command on a running container

To run a command on a running container, use the following command:

```console
docker exec -it <container id> <command>
```

This command will run the `<command>` on the container.

If you want to start a new shell session on the running container, you can use the following command:

```console
docker exec -it <container id> /bin/bash
```

This command will start a new bash session on the container.

Other useful options include:

Option                | Description
--------------------- | -------------------------------------
`--interactive`, `-i` | Keep STDIN open even if not attached.
`--tty`, `-t`         | Allocate a pseudo-TTY.

## Images

### List all images

To list all images on the machine, use the following command:

```console
docker image ls --all
```

The `-a` or `--all` option is used to show all images, including intermediate images. To display only the IDs of the images, use the `-q` or `--quiet` option, as shown below:

```console
docker image ls --all -quiet
```

Other useful options include:

Option          | Description
--------------- | ----------------------------------------------------
`-a`, `--all`   | Show all images (default hides intermediate images).
`-q`, `--quiet` | Only show numeric IDs.

For more information, refer to the [Docker documentation](https://docs.docker.com/engine/reference/commandline/image_ls/).

### Remove an image

To remove an image from your local machine, you can use the following command:

```console
docker image rm <image id>
```

### Remove all images

To remove all images, including intermediate and dangling images, use the following command:

```console
docker image rm $(docker image ls --all --quiet)
```

This command will delete all images. The command `docker image ls -a -q` will return all existing image IDs and pass them to the `docker image rm` command which will delete them.

It's recommended to be cautious while removing images, as it may cause disruption to running containers. Before removing the images, make sure they are not used by any running containers or dependent services.

## Containers

### List all running containers

To list all running containers, use the following command:

```console
docker container ls
```

Alternatively, you can use the following command which provides the same output:

```console
docker ps
```

To only show the IDs of all containers, use the `-q` or `--quiet` option:

```console
docker container ls --quiet
```

Other useful options include:

Option          | Description
--------------- | ----------------------------------------------------
`-q`, `--quiet` | Only show numeric IDs.

For more information about this command, refer to the [`docker container ls` documentation](https://docs.docker.com/engine/reference/commandline/container_ls/) or [`docker ps` documentation](https://docs.docker.com/engine/reference/commandline/ps/).

### List all containers

To list all containers, including those not running, use the following command:

```console
docker container ls --all
```

To only show the IDs of all containers, use the `-q` or `--quiet` option:

```console
docker container ls --all --quiet
```

Other useful options include:

Option          | Description
--------------- | ----------------------------------------------------
`-a`, `--all`   | Show all containers (default shows just running).
`-q`, `--quiet` | Only show numeric IDs.

For more information about this command, refer to the [Docker documentation](https://docs.docker.com/engine/reference/commandline/container_ls/).

### Stop a container

To stop a container, use the following command:

```console
docker container stop <hash>
```

This command will gracefully stop the specified container.

For more information on stopping and killing containers, refer to the [Docker documentation](https://docs.docker.com/engine/reference/commandline/stop/).

### Stop all running containers

To gracefully stop all running containers, use the following command:

```console
docker container stop $(docker ps --quiet)
```

This command will retrieve all running container IDs by running `docker ps -q` and then pass them to the `docker container stop` command which will gracefully stop all running containers.

### Kill a container

To force shutdown a container, use the following command:

```console
docker container kill <hash>
```

This command will immediately stop the container, similar to unplugging a machine.

For more information about this command, refer to the [Docker documentation](https://docs.docker.com/engine/reference/commandline/kill/).

### Kill all running containers

To kill all running containers, you can use the following command:

```console
docker container kill $(docker ps --quiet)
```

The `docker ps --quiet` command returns the IDs of all running containers, which are then passed to the `docker container kill` command to force shutdown them.

### Remove a container

To remove a container, use the following command:

```console
docker container rm <hash>
```

This command will remove the specified container from the current machine. Note that the container must be stopped before it can be removed. If you want to remove a running container, you can use the `--force` or `-f` option to force the removal.

```console
docker container rm --force <hash>
```

For more information about this command and its options, refer to the [Docker documentation](https://docs.docker.com/engine/reference/commandline/container_rm/).

### Remove all stopped containers

To remove all stopped containers, you can use the following command:

```console
docker container prune
```

Alternatively, you can use the following command to manually delete all stopped containers:

```console
docker container rm $(docker ps --all --quiet --filter "status=exited")
```

This command will use the `docker ps` command to find all containers that have an exited status, and then delete them using the `docker container rm` command.

Note that any running containers will not be deleted by these commands.

### Remove all containers

To remove all containers, including those that are currently running, use the following command:

```console
docker container rm $(docker ps --all --quiet)
```

This command will use the `docker ps` command to find all containers, and then delete them using the `docker container rm` command.

## Registry

### Upload tagged image to registry

The Docker registry is a central place to store and distribute Docker images. To upload your Docker images to the registry, you first need to tag and push them. Here is how you can do it:

1. Log in to your Docker account using the `docker login` command. This command will prompt you to enter your Docker credentials:

    ```console
    $ docker login
    ```

1. Tag your local Docker image with a name that includes the Docker registry username, repository name, and version tag:

    ```console
    docker tag <image> username/repository:tag
    ```

    Here's an example:

    ```console
    docker tag my-image username/my-repo:v1.0
    ```

1. Push the tagged image to the registry using the `docker push` command:

    ```console
    docker push username/repository:tag
    ```

    Here's an example:

    ```console
    docker push username/my-repo:v1.0
    ```

    This command uploads the tagged image to the registry. Make sure that you have the necessary permissions to push images to the repository.

1. After you have pushed your image, you can log out of your Docker account using the `docker logout` command:

    ```console
    docker logout
    ```

    By logging out, you ensure that no one else can push images to your account from this CLI session.

For more information about the Docker registry and how to use it, see the [Docker documentation](https://docs.docker.com/registry/).

## System

### Remove all unused containers, networks and images.

To remove all unused containers, networks, and images, use the following command:

```console
docker system prune
```

To remove all images, including the ones that are in use, use the `--all` option:

```console
docker system prune --all
```

Other useful options include:

Option           | Description
---------------- | ----------------------------------------------------
`-a`, `--all`    | Remove all unused images not just dangling ones.
`--force` , `-f` | Do not prompt for confirmation.
`--volumes`      | Prune volumes.

For more information about this command, refer to the [Docker documentation](https://docs.docker.com/engine/reference/commandline/system_prune/).
