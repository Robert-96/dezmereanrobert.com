const data = require('./data.js');
const post = data.post;

describe('Post Page', () => {
  beforeAll(async () => {
    await page.goto(post.url);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();

    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
    expect(pageTitle).toMatch(post.title);
  });

  it('should have the correct heading', async () => {
    const pageHeading = await page.$eval('h1', el => el.innerText);

    expect(pageHeading).toBe(post.title);
  });
});
