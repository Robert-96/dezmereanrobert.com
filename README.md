# Robert-96.github.io

My boring personal website.

## Development Setup

### Prerequisites

* [hugo](https://gohugo.io/)
* [node](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

### Start the development server

To start the development server with drafts enabled:

```bash
$ npm run dev
```

Navigate to the site at http://localhost:1313/.

### Build

To build the static pages run:

```bash
$ npm run build
```

Output will be in `./public/` directory.

To build without drafts enabled just call:

```
$ npm run build-prod
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
