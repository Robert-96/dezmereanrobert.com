---
title: "CLI tools from the Python3 Standard Library"
subtitle: "Exploring the Command-Line Interface (CLI) Tools Included in the Python 3 Standard Library"
date: 2021-10-13T00:03:29+03:00
tags: [ "python", "json" ]
keywords: [ "python", "json", "cli", "webserver", "gzip", "zipfile", "tarfile" ]
draft: false
---

Python3 comes with a wide range of powerful and useful tools that can be accessed via the command-line. In this article, we'll take a look at some of the most useful tools that come with the Python3 Standard Library.

<!--more-->

## TL;DR

```console
python -m http.server                           # Create a webserver serving files relative to the current directory
python -m http.server 8080                      # Start the webserver on port 8080
python -m http.server -b 127.0.0.1              # Bind the webserver to 127.0.0.1
python -m http.server -d path/to/files          # Serve files relative to path/to/files

echo '{"key": "value"}' | python3 -m json.tool  # Pretty-print JSON objects

python -m gzip data.json                        # Compress data.json
python -m gzip -d data.json.gz                  # Decompress data.json.gz

python -m zipfile -c archive.zip data.txt       # Create zipfile named archive.zip from source file data.txt
python -m zipfile -e archive.zip .              # Extract zipfile into current directory

python -m tarfile -c archive.tar data.txt       # Create tarfile name archive.tar from source file data.txt
python -m tarfile -e archive.tar .              # Extract tarfile into current directory
```

## Http Server

The `http.server` module provides a simple command-line interface to create a basic web server. The server will serve files from the current directory unless an alternative directory is specified.

> **Warning**: It is **not recommended** to use `http.server` in a production environment. It only implements basic security checks.

Here's an example:

```console
python -m http.server
```

This command will start a webserver on port `8000`, which serves files from the current directory. If you want to change the port use the first positional argument to specify an alternate port:

```console
python -m http.server 8080
```

If you want to serve files from a different directory, you can specify it with the `-d` option:

```console
python -m http.server -d /path/to/directory
```

Option                                  | Description
--------------------------------------- | -------------------------------------
`--bind`, `-b ADDRESS`                  | Specify alternate bind address. (Default: `0.0.0.0`)
`--directory`, `-d DIRECTORY`           | Specify alternative directory. (Default: current working directory)
`--cgi`                                 | Run a CGI Server.

Read more in the [documentation](https://docs.python.org/3/library/http.server.html#module-http.server).

## JSON

The `json.tool` module provides a simple command-line interface to validate and pretty-print JSON objects. It can be used to format JSON data so it's more human-readable and easier to understand.

```console
python -m json.tool <INFILE> <OUTFILE>
```

Here's an example:

```console
python -m json.tool onld.json new.json
```

This command will pretty-print the JSON object so it's easier to read.

If the optional `infile` and `outfile` arguments are not specified, `sys.stdin` and `sys.stdout` will be used respectively.

```console
$ echo '{"key": "value"}' | python3 -m json.tool
{
    "key": "value"
}
```

```console
$ echo '{key: "value"}' | python3 -m json.tool
Expecting property name: line 1 column 2 (char 1)
```

Other useful options include:

Option                                  | Description
--------------------------------------- | -------------------------------------
`--sort-keys`                           | Sort the output of dictionaries alphabetically by key.
`--json-lines`                          | Parse every input line as separate JSON object.

Read more in the [documentation](https://docs.python.org/3/library/json.html#module-json.tool).

## GZIP

The `gzip` module provides a simple command-line interface to compress or decompress files just like the GNU programs `gzip` and `gunzip` would.

```console
python -m gzip <FILE>
```

Here's an example:

```console
python -m gzip data.json
```

This command will compress the `data.json` into a new file called `data.json.gz`. If you want to decompress a file, you can use the `-d` option:

```console
python -m gzip -d data.json.gz
```

This command will decompress the `data.json.gz` file.

Other useful options include:

Option                                  | Description
--------------------------------------- | -------------------------------------
`--fast`                                | Indicates the fastest compression method (less compression).
`--best`                                | Indicates the slowest compression method (best compression).
`-d`, `--decompress`                    | Decompress the given file.

Read more in the [documentation](https://docs.python.org/3/library/gzip.html#command-line-interface).

## ZIP

The `zipfile` module provides a simple command-line interface to create, extract, and manipulate ZIP archives.

To create a new ZIP archive, use the `-c` option followed by the ZIP archive name and the filename(s) to include:

```console
python -m zipfile -c <ZIP-FILE> <SOURCE-FILE-1> [... <SOURCE-FILE-N>]
```

Here's an example of creating a new ZIP archive:

```console
python -m zipfile -c archive.zip data.txt
```

This command creates a new ZIP archive named `archive.zip` that includes `data.txt`.

To extract a ZIP archive into the specified directory, use the `-e` option:

```console
python -m zipfile -e <ZIP-FILE> <OUTPUT-DIR>
```

Here's an example of extracting a ZIP archive:

```console
python -m zipfile -e archive.zip .
```

This command extracts all files from `archive.zip` to the current directory.

To list the files in a ZIP archive, use the `-l` option:

```console
python -m zipfile -l archive.zip
```

This command lists all files in the `archive.zip` ZIP archive.

Other useful options include:

Option                                             | Description
-------------------------------------------------- | -------------------------------------
`-c`, `--create ZIP-FILE SOURCE-1 [... SOURCE-N]`  | Create zipfile from source files.
`-e`, `--extract ZIP-FILE OUTPUT-DIR`              | Extract zipfile into target directory.
`-l`, `--list ZIP-FILE`                            | List files in a zipfile.
`-t`, `--test ZIP-FILE`                            | Test whether the zipfile is valid or not.

Read more in the [documentation](https://docs.python.org/3/library/zipfile.html#command-line-interface).

## TAR

The `tarfile` module provides a simple command-line interface to work with tar archives.

If you want to create a new TAR archive, specify its name after the `-c` option and then list the filename(s) that should be included:

```console
python -m tarfile -c <TAR-FILE> <SOURCE-FILE-1> [... <SOURCE-FILE-N>]
```

Here's an example of creating a new TAR archive:

```console
python -m tarfile -c archive.tar data.txt
```

This command will create a new TAR archive named `archive.tar` that will include `data.txt`.

If you want to extract a TAR archive into the specified directory, use the `-e` option:

```console
python -m tarfile -e <TAR-FILE> <OUTPUT-DIR>
```

Here's an example of extracting a TAR archive:

```console
python -m tarfile -e archive.tar .
```

This command will extract all files from `archive.tar` into the current directory.

To list the files in a TAR archive, use the `-l` option:

```
python -m tarfile -l archive.tar
```

This command will list all files in the `archive.tar` TAR archive.

Other useful options include:

Option                                             | Description
-------------------------------------------------- | -------------------------------------
`-c`, `--create TAR-FILE SOURCE-1 [... SOURCE-N]`  | Create tarfile from source files.
`-e`, `--extract TAR-FILE OUTPUT-DIR`              | Extract tarfile into target directory.
`-l`, `--list TAR-FILE`                            | List files in a tarfile.
`-t`, `--test TAR-FILE`                            | Test whether the tarfile is valid or not.

Read more in the [documentation](https://docs.python.org/3.8/library/tarfile.html#command-line-interface).
