const helpers = require('./helpers.js');
const project = require('./data.js').project;

describe('Projects Page', () => {
  beforeAll(async () => {
    await page.goto(`${PATH}/projects`);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();

    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
    expect(pageTitle).toMatch('Projects');
  });

  it('should have the correct heading', async () => {
    const pageHeading = await page.$eval('h1', el => el.innerText);

    expect(pageHeading).toBe('Projects');
  });

  it('should be at least one project', async () => {
    await helpers.assertTitlesExist('h2');
  });

  it(`should contain the "${project.title}" project`, async () => {
    await helpers.assertTitlesContain(project.title, tag = 'h2');
  });
});
