---
title: "Jenkins Pipeline for AltWalker"
subtitle: Set up your first Jenkins Pipeline for your AltWalker tests.
date: 2021-10-03T17:35:06+03:00
tags: [ "altwalker", "jenkins" , "python", "dotnet" ]
draft: true
featured: true
---

This tutorial should help you setup a CI/CD pipeline on Jenkins for your [AltWalker](https://altom.gitlab.io/altwalker/altwalker/) tests.

<!--more-->

## Table Of Contents

* [Create your first Pipeline ](#create-your-first-pipeline)
* [Quick Start Examples](#quick-start-examples)
* [Setup XML Reports](#setup-xml-reports)
* [Using a `Dockerfile`](#using-a-raw-dockerfile-endraw-)
* [Examples](#examples)
* [Resources](#resources)

## Create your first Pipeline

1. Copy one of the examples below into your repository and name it `Jenkinsfile`. Try modifying the `sh` command to run the same command you would run on your local machine.

    ```
    pipeline {
        agent {
            docker {
                image 'altwalker/altwalker:latest'
                args '-u root:root'
            }
        }
        stages {
            stage('test') {
                steps {
                    sh 'altwalker online tests -m model/default.json "random(vertex_coverage(100))"'
                }
            }
        }
    }
    ```

2. Click the **New Item** menu within Jenkins

3. Provide a name for your new item (e.g. *My-AltWalker-Pipeline*) and select **Multibranch Pipeline**.

4. Click the **Add Source** button, choose the type of repository you want to use and fill in the details.

5. Click the **Save** button and watch your first Pipeline run!

## Quick Start Examples

Below are some easily copied and pasted examples of a simple Pipeline for Python and .NET.

### Python

```
pipeline {
    agent {
        docker {
            image 'altwalker/altwalker:latest'
            args '-u root:root'
        }
    }
    stages {
        stage('test') {
            steps {
                sh 'altwalker online tests -m models/model.json "random(vertex_coverage(100))"'
            }
        }
    }
}
```

### .NET

```
pipeline {
    agent {
        docker {
            image 'altwalker/altwalker:latest-dotnet-3.1'
            args '-u root:root'
        }
    }
    stages {
        stage('test') {
            steps {
                sh 'altwalker online tests --language dotnet -m models/model.json "random(vertex_coverage(100))"'
            }
        }
    }
}
```

For more information about all the tags supported by the AltWalker docker images check out the docker repository for [`altwalker/altwalker`](https://hub.docker.com/r/altwalker/altwalker).

## Setup XML Reports

After you setup for first pipeline:

1. To generate the XML reports add the `--report-xml` to your `online` or `walk` command.

2. Inside the `Jenkinsfile` after the `online` or `walk` command add the following line:

    ```
    junit 'report.xml'
    ```

For a python project the `Jenkinsfile` should look like this:

```
pipeline {
    agent {
        docker {
            image 'altwalker/altwalker:latest'
            args '-u root:root'
        }
    }
    stages {
        stage('test') {
            steps {
                sh 'altwalker online tests -m models/model.json "random(vertex_coverage(100))" --report-xml'
                junit 'report.xml'
            }
        }
    }
}
```

## Using a `Dockerfile`

For projects which require a more customized execution environment, Pipeline also supports building and running a container from a `Dockerfile` in the source repository.

1. Copy one of the examples below into your repository and name it `Dockerfile`:

    ```
    FROM altwalker/altwalker:latest

    # Install your specific requirements
    ```

2. Replace `image 'altwalker/altwalker:latest'` with `dockerfile true` from one of the previous example.

In contrast to the previous approach of using an *"off-the-shelf"* container, using the agent `{ dockerfile true }` syntax will build a new image from your `Dockerfile` rather than pulling one from Docker Hub.

For a python project the `Jenkinsfile` should look like this:

```
pipeline {
        agent {
            docker {
                dockerfile true
                args '-u root:root'
            }
        }
        stages {
            stage('test') {
                steps {
                    sh 'altwalker online tests -m model/default.json "random(vertex_coverage(100))"'
                }
            }
        }
    }
```

The agent `{ dockerfile true }` syntax supports a number of other options which are described in more detail in the [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/#agent) section.

## Examples

For a fully working example you can check out:

* for Python: https://github.com/Robert-96/altwalker-jenkins-example
* for .NET: https://github.com/Robert-96/altwalker-jenkins-dotnet-example

## Resources

* Jenkins:
  * https://www.jenkins.io/doc/pipeline/tour/hello-world/
  * https://www.jenkins.io/doc/book/pipeline/
* AltWalker:
  * https://altom.gitlab.io/altwalker/altwalker/
  * https://hub.docker.com/r/altwalker/altwalker/
