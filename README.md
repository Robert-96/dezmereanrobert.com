# Robert-96.github.io

My boring personal website.

## Development Setup

### Prerequisites

* [hugo](https://gohugo.io/)

### Start the Hugo server

To start the Hugo server with drafts enabled:

```bash
$ hugo serve -D
```

Navigate to the site at http://localhost:1313/.

### Build

To build the static pages run:

```bash
$ hugo -D
```

Output will be in `./public/` directory by default (`-d/--destination` flag to change it).

To build without drafts enabled just call:

```
$ hugo
```

### Add Some Content

To create a new post run:

```
$ hugo new posts/my-first-post.md
```

To create a new project run:

```
$ hugo new project/my-first-project.md
```
