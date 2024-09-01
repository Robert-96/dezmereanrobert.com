const data = require('./data.js');
const helpers = require('./helpers.js');
const post = data.post;
const project = data.project;

describe('Main Page', () => {
  beforeAll(async () => {
    await page.goto(PATH);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();

    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
  });

  it('should have the correct heading', async () => {
    const pageHeading = await page.$eval('h1', el => el.innerText);

    expect(pageHeading).toBe('Hi, I\'m Dezmerean Robert');
  });

  it('should be at least one feature post', async () => {
    await helpers.assertTitlesExist('h2');
  });

  it(`should contain the "${project.title}" featured project`, async () => {
    await helpers.assertTitlesContain(project.title, tag = 'h2');
  });

  it(`should contain the "${post.title}" featured post`, async () => {
    await helpers.assertTitlesContain(post.title, tag = 'h2');
  });

  it(`should contain the "${post.title}"`, async () => {
    await helpers.assertTitlesContain(post.title, tag = 'h2');
  });
});
