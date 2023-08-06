# Robert-96.github.io

My boring personal blog.

## Development Setup

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you get started, make sure you have the following installed on your machine:

* [hugo](https://gohugo.io/)
* [node](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

### Setup

Follow these steps to set up the project:

```bash
git clone https://github.com/Robert-96/dezmereanrobert.com.git
cd dezmereanrobert.com
npm install
```

### Start the development server

To launch the development server with drafts enabled, use the following command:

```bash
npm run dev
```

You can then access the development site at <http://localhost:1313/>.

### Build

To generate the static pages for the blog, run:

```bash
npm run build
```

The output will be generated in the `./public/` directory.

For building without drafts enabled, use:

```bash
npm run build-prod
```

### Run Tests

To run the tests, execute the following command:

```bash
npm test
```

### Add Content

To create a new blog post, use the following command:

```bash
hugo new posts/my-first-post.md
```

For creating a new project page, use:

```bash
hugo new project/my-first-project.md
```
