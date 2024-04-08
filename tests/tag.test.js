const data = require('./data.js')
const post = data.post;

describe('Tag Page', () => {
  beforeAll(async () => {
    await page.goto(`${PATH}/tags/test`);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();

    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
    expect(pageTitle).toMatch('Test');
  });

  it('should have the correct heading', async () => {
    const pageHeading = await page.$eval('h1', el => el.innerText);

    expect(pageHeading).toBe('#test');
  });

  it('should be at least one post with the tag', async () => {
    const postTitles = await page.$$eval('h2', elements => elements.map(el => el.innerText));

    expect(Array.isArray(postTitles)).toBe(true);
    expect(postTitles.length).toBeGreaterThan(0);
  });

  it(`should contain the "${post.title}"`, async () => {
    const postTitles = await page.$$eval('h2', elements => elements.map(el => el.innerText));

    expect(postTitles).toContain(post.title);
  });
});
