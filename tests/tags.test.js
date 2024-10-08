const data = require('./data.js');
const helpers = require('./helpers.js');
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
    await helpers.assertTitlesExist('h3');
  });

  it(`should contain the "${post.title}"`, async () => {
    await helpers.assertTitlesContain(post.title, tag = 'h3');
  });
});
