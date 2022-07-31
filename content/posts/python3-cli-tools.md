---
title: "Python3 Cli Tools"
date: 2021-10-13T00:03:29+03:00
tags: [ "python" ]
draft: true
---

CLI tools from the Python3 Standard Library.

<!--more-->

## TL;DR

```
$ python -m http.server                           # Create a webserver serving files relative to the current directory
$ python -m http.server 8080                      # Start the webserver on port 8080
$ python -m http.server -b 127.0.0.1              # Bind the webserver to 127.0.0.1
$ python -m http.server -d path/to/files          # Serve files relative to path/to/files

$ echo '{"key": "value"}' | python3 -m json.tool  # Pretty-print JSON objects

$ python -m gzip data.json                        # Compress data.json
$ python -m gzip -d data.json.gz                  # Decompress data.json.gz

$ python -m zipfile -c archive.zip data.txt       # Create zipfile named archive.zip from source file data.txt
$ python -m zipfile -e archive.zip .              # Extract zipfile into current directory

$ python -m tarfile -c archive.tar data.txt       # Create tarfile name archive.tar from source file data.txt
$ python -m tarfile -e archive.tar .              # Extract tarfile into current directory
```

## Table of contents

* [Http Server](#http-server)
* [JSON](#json)
* [GZIP](#gzip)
* [ZIP](#zip)
* [TAR](#tar)

## Http Server

The `http.server` module provides a simple command line interface to create a very basic webserver.

```
$ python -m http.server
```

This command will create a very basic webserver serving files relative to the current directory.

```
$ python -m http.server 8080
```

The first positional argument will specify an alternate port.

Option                                  | Description
--------------------------------------- | -------------------------------------
`--bind`, `-b ADDRESS`                  | Specify alternate bind address. (Default: `0.0.0.0`)
`--directory`, `-d DIRECTORY`           | Specify alternative directory. (Default: current working directory)
`--cgi`                                 | Run a CGI Server.

Read more in the [documentation](https://docs.python.org/3/library/http.server.html#module-http.server).

## JSON

The `json.tool` module provides a simple command line interface to validate and pretty-print JSON objects.

```
$ python -m json.tool <INFILE> <OUTFILE>
```

If the optional infile and outfile arguments are not specified, `sys.stdin` and `sys.stdout` will be used respectively.

```
$ echo '{"key": "value"}' | python3 -m json.tool
{
    "key": "value"
}
```

```
$ echo '{key: "value"}' | python3 -m json.tool
Expecting property name: line 1 column 2 (char 1)
```

Option                                  | Description
--------------------------------------- | -------------------------------------
`--sort-keys`                           | Sort the output of dictionaries alphabetically by key.
`--json-lines`                          | Parse every input line as separate JSON object.

Read more in the [documentation](https://docs.python.org/3/library/json.html#module-json.tool).

## GZIP

The `gzip` module provides a simple command line interface to compress or decompress files just like the GNU programs `gzip` and `gunzip` would.

```
$ python -m gzip <FILE>
```

```
$ python -m gzip data.json
```

This command will compress the `data.json`.


```
$ python -m gzip -d data.json.gz
```

This command will decompress the `data.json.gz` file .

Option                                  | Description
--------------------------------------- | -------------------------------------
`--fast`                                | Indicates the fastest compression method (less compression).
`--best`                                | Indicates the slowest compression method (best compression).
`-d`, `--decompress`                    | Decompress the given file.

Read more in the [documentation](https://docs.python.org/3/library/gzip.html#command-line-interface).

## ZIP

The `zipfile` module provides a simple command-line interface to interact with ZIP archives.

```
$ python -m zipfile -c <ZIP-FILE> <SOURCE-FILE-1> [... <SOURCE-FILE-N>]
```

If you want to create a new ZIP archive, specify its name after the `-c` option and then list the filename(s) that should be included.

```
$ python -m zipfile -c archive.zip data.txt
```

This command will create a new ZIP archive neame `archive.zip` that will include `data.txt`.

```
$ python -m zipfile -e <ZIP-FILE> <OUTPUT-DIR>
```

If you want to extract a ZIP archive into the specified directory, use the `-e` option.

```
$ python -m zipfile -e archive.zip .
```

This command will extract all files from `archive.zip` inside the current directory.

```
$ python -m zipfile -l <ZIP-FILE>
```

For a list of the files in a ZIP archive, use the `-l` option.

```
$ python -m zipfile -l archive.zip
```

This command will list all files from the `archive.zip` ZIP archive.

Option                                             | Description
-------------------------------------------------- | -------------------------------------
`-c`, `--create ZIP-FILE SOURCE-1 [... SOURCE-N]`  | Create zipfile from source files.
`-e`, `--extract ZIP-FILE OUTPUT-DIR`              | Extract zipfile into target directory.
`-l`, `--list ZIP-FILE`                            | List files in a zipfile.
`-t`, `--test ZIP-FILE`                            | Test whether the zipfile is valid or not.

Read more in the [documentation](https://docs.python.org/3/library/zipfile.html#command-line-interface).

## TAR

The `tarfile` module provides a simple command-line interface to interact with tar archives.

```
$ python -m tarfile -c <TAR-FILE> <SOURCE-FILE-1> [... <SOURCE-FILE-N>]
```

If you want to create a new TAR archive, specify its name after the `-c` option and then list the filename(s) that should be included.

```
$ python -m tarfile -c archive.tar data.txt
```

This command will create a new TAR archive neame `archive.tar` that will include `data.txt`.

```
$ python -m tarfile -e <TAR-FILE> <OUTPUT-DIR>
```

If you want to extract a TAR archive into the specified directory, use the `-e` option.

```
$ python -m tarfile -e archive.tar .
```

This command will extract all files from `archive.tar` inside the current directory.

```
$ python -m tarfile -l <TAR-FILE>
```

For a list of the files in a TAR archive, use the `-l` option.

```
$ python -m tarfile -l archive.tar
```

This command will list all files from the `archive.tar` TAR archive.

Option                                             | Description
-------------------------------------------------- | -------------------------------------
`-c`, `--create TAR-FILE SOURCE-1 [... SOURCE-N]`  | Create tarfile from source files.
`-e`, `--extract TAR-FILE OUTPUT-DIR`              | Extract tarfile into target directory.
`-l`, `--list TAR-FILE`                            | List files in a tarfile.
`-t`, `--test TAR-FILE`                            | Test whether the tarfile is valid or not.

Read more in the [documentation](https://docs.python.org/3.8/library/tarfile.html#command-line-interface).
