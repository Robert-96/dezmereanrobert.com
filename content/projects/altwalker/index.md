---
title: "AltWalker - A Model-Based Testing Framework"
subtitle: "AltWalker is an open source **Model-Based Testing** framework that supports running tests written in **Python3** and **.NET**."
date: 2024-01-01
keywords: [ "python", "java", "graphwalker", "model-based-testing", "testing" ]
tags: [ "Python", "Java", "GraphWalker", ".NET" ]
website: "https://pypi.org/project/altwalker"
sourceCode: "https://github.com/altwalker/altwalker"
documentation: "https://altwalker.github.io/altwalker"
draft: false
featured: true
---

AltWalker is an **open-source Model-Based Testing framework** that I developed in 2018 and have maintained since. It supports running tests written in **Python 3** and **.NET/C#**. With AltWalker, you design your tests as a directed graph, and it generates test cases from your graph using [GraphWalker](http://graphwalker.github.io/) and executes them.

AltWalker has garnered substantial attention, accumulating **over 46K downloads** on PyPi.

<!--more-->

{{< figure src="./pypi-screenshot.png" alt="Screenshot of the AltWalker PyPi page." >}}

## What is Model-Based Testing?

Model-Based Testing is a powerful technique for generating test cases based on models that describe the behaviour (functionality) of the system under test.

The goal of designing models is to represent different parts of the system under test, typically with one model for each functionality.

Using graph theory, AltWalker dynamically generates multiple test scripts. A test script represents a path passing through the model from a starting point until a condition is met.

### Why use Model-Based Testing?

* **Improved Test Structure**: The abstraction layer provided by the model enhances the structure of your tests.
* **Ease of Maintenance**: Models can be updated to reflect changes in requirements, making tests easier to maintain.
* **Dynamic Test Generation**: Generates multiple test scripts based on different conditions such as coverage or length.
* **Increased Test Coverage**: Allows for the creation of a large number of tests, resulting in broader coverage of the system under test.

## Key Features

AltWalker simplifies writing and running model-based tests. It utilizes GraphWalker to generate paths through the models.

* **Object-Oriented Approach**: Test structure is based on an object-oriented approach inspired by Python's `unittest` module. Each model is mapped to a class with the same name, and each vertex and edge from the model is mapped to a method inside the class.
* **Test Fixtures**: Implements fixtures such as `setUpRun`, `tearDownRun`, `setUpModel`, and `tearDownModel`.
* **Supports .NET and Python 3**: AltWalker now supports running tests written in both .NET and Python 3.

By leveraging AltWalker, you can streamline the process of designing and executing model-based tests, increasing the test coverage of the system under test.
