const data = require('./data.js');
const helpers = require('./helpers.js');
const post = data.post;

describe('Posts Page', () => {
  beforeAll(async () => {
    await page.goto(`${PATH}/posts`);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();

    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
    expect(pageTitle).toMatch('Posts');
  });

  it('should have the correct heading', async () => {
    const pageHeading = await page.$eval('h1', el => el.innerText);

    expect(pageHeading).toBe('Posts');
  });

  it('should be at least one post', async () => {
    await helpers.assertTitlesExist('h2');
  });

  it(`should contain the "${post.title}"`, async () => {
    const postTitles = await page.$$eval('h2', elements => elements.map(el => el.innerText));

    expect(postTitles).toContain(post.title);
  });
});
