const data = require('./data.js')
const post = data.post;

describe('Tags Page', () => {
  beforeAll(async () => {
    await page.goto(`${PATH}/tags`);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();

    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
    expect(pageTitle).toMatch('Tags');
  });

  it('should have the correct heading', async () => {
    const pageHeading = await page.$eval('h1', el => el.innerText);

    expect(pageHeading).toBe('Tags');
  });

  it('should be at least one tag', async () => {
    const tagsNames = await page.$$eval('h2', elements => elements.map(el => el.innerText));

    expect(Array.isArray(tagsNames)).toBe(true);
    expect(tagsNames.length).toBeGreaterThan(0);
  });

  it('should be at least one post', async () => {
    const postTitles = await page.$$eval('h3', elements => elements.map(el => el.innerText));

    expect(Array.isArray(postTitles)).toBe(true);
    expect(postTitles.length).toBeGreaterThan(0);
  });

  it(`should contain the "${post.title}"`, async () => {
    const postTitles = await page.$$eval('h3', elements => elements.map(el => el.innerText));

    expect(postTitles).toContain(post.title);
  });
});
