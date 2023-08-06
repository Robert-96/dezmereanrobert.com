const urls = [
  { title: 'Main', path: PATH },
  { title: 'Posts', path: `${PATH}/posts` },
  { title: 'My First Post', path: `${PATH}/posts/my-first-post` },
  { title: 'Tags', path: `${PATH}/tags` },
  { title: 'markdown', path: `${PATH}/tags/markdown` },
  { title: 'Projects', path: `${PATH}/projects` },
  { title: 'About Me', path: `${PATH}/about` }
]

const post = {
  url: `${PATH}/posts/my-first-post`,
  title: 'DRAFT: My First Post',
  subtitle: 'This is an test post that uses all the markdown features. This post should always remain a draft.',
  tags: ['test', 'markdown', 'hugo', 'github']
}

module.exports = {
  urls: urls,
  post: post
}
