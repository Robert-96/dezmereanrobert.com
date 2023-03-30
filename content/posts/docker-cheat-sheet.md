---
title: "Docker CLI Cheat Sheet"
subtitle: "My docker commands cheat sheet."
date: 2021-10-13T00:00:35+03:00
tags: [ "docker" ]
draft: false
featured: true
---

This Docker cheat sheet provides a quick overview of all the basic commands. It can’t cover every edge case, so if you need more information about any of these elements, refer to the [Docker documentation](https://docs.docker.com/).

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

```console
$ docker build -t my-image .
```

This command will create a image using this directory's `Dockerfile` and the current directory as the context.

```console
$ docker build -f Dockerfile.dev -t my-image .
```

This command will create a image using this directory's `Dockerfile.dev` and the current directory as the context.

Option          | Description
--------------- | ------------------------------------------------------
`--file`, `-f`  | Name of the Dockerfile (Default is `PATH/Dockerfile`).
`--tag`, `-t`   | Name and optionally a tag in the "name:tag" format.

## Run

### Run an image

```console
$ docker run -p 4200:80 my-image
```

This command will run "my-image" mapping port 4200 on the host machine to 80 from the container.

```console
$ docker run -d -p 4200:80 my-image
```

This command will do the same thing but in detached mode.

Option                                  | Description
--------------------------------------- | -------------------------------------
`--detach , -d`                         | Run container in background and print container ID.
`--publish , -p HOSTPORT:CONTAINERPORT` | Publish a container’s port(s) to the host

### Run an image from a registry

```console
$ docker run username/repository:tag
```

This command will run the `username/repository:tag` image.

### Run a command on an image

```console
$ docker run my-image <command>
```

This command will run the `<command>` on a container started from "my-image".

```console
$ docker run -it my-image /bin/bash
```

This command will start a new bash session on a container started from "my-image".

Option                | Description
--------------------- | -------------------------------------
`--interactive`, `-i` | Keep STDIN open even if not attached.
`--tty`, `-t`         | Allocate a pseudo-TTY.

### Run a command on a running container

```console
$ docker exec -it <container id> <command>
```

This command will run the `<command>` on the container.

```console
$ docker exec -it <container id> /bin/bash
```

This command will start a new bash session on the container.

Option                | Description
--------------------- | -------------------------------------
`--interactive`, `-i` | Keep STDIN open even if not attached.
`--tty`, `-t`         | Allocate a pseudo-TTY.

## Images

### List all images

```console
$ docker image ls -a
```

This command will list all images on this machine.

```console
$ docker image ls -a -q
```

This command will do the same but show only the IDs.

Option          | Description
--------------- | ----------------------------------------------------
`-a`, `--all`   | Show all images (default hides intermediate images).
`-q`, `--quiet` | Only show numeric IDs.

### Remove an image

```console
$ docker image rm <image id>
```

This command will remove the specified image from this machine.

### Remove all images

```console
$ docker image rm $(docker image ls -a -q)
```

This command will delete all images. The command `docker image ls -a -q` will return all existing image IDs and pass them to the rm command which will delete them.

## Containers

### List all running containers

```console
$ docker container ls
```

This command will list all running containers.

```console
$ docker ps
```

This command will do the same.

```console
$ docker container ls -q
```

This command will do the same but only show the IDs.

Option          | Description
--------------- | ----------------------------------------------------
`-q`, `--quiet` | Only show numeric IDs.

### List all containers

```console
$ docker container ls -a
```

This command will list all containers, even those not running.

```console
$ docker container ls -a -q
```

This command will do the same but only show the IDs.

Option          | Description
--------------- | ----------------------------------------------------
`-a`, `--all`   | Show all containers (default shows just running).
`-q`, `--quiet` | Only show numeric IDs.

### Stop a container

```console
$ docker container stop <hash>
```

This command will gracefully stop the specified container.

### Stop all running containers

```console
$ docker container stop $(docker ps -q)
```

This command will gracefully stop all running containers. The command `docker ps -q` will return all running container IDs and pass them to the stop command which will gracefully stop them.

### Kill a container

```console
$ docker container kill <hash>
```

This command will force shutdown of the specified container.

### Kill all running containers

```console
$ docker container kill $(docker ps -q)
```

This command will force shutdown all running containers. The command `docker ps -q` will return all running container IDs and pass them to the kill command which will force shutdown them.

### Remove a container

```console
$ docker container rm <hash>
```

This command will remove the specified container from this machine.

### Remove all stopped containers

```console
$ docker rm $(docker ps -a -q)
```

This command will delete all stopped containers. The command `docker ps -a -q` will return all existing container IDs and pass them to the rm command which will delete them. Any running containers will not be deleted.

## Registry

### Upload tagged image to registry

```console
$ docker login
```

Log in this CLI session using your Docker credentials.

```console
$ docker tag <image> username/repository:tag
```

Tag `<image>` for upload to registry.

```console
$ docker push username/repository:tag
```

Upload tagged image to registry.

```console
$ docker logout
```

Log out of this CLI session.

## System

### Remove all unused containers, networks and images.

```console
$ docker system prune
```

This command remove all unused (dangling) containers, networks and images.

```console
$ docker system prune --all
```

This command remove all images unused images not just dangling ones.

Option           | Description
---------------- | ----------------------------------------------------
`-a`, `--all`    | Remove all unused images not just dangling ones.
`--force` , `-f` | Do not prompt for confirmation.
`--volumes`      | Prune volumes.
