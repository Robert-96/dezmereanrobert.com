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
    const projectTitles = await page.$$eval('h2', elements => elements.map(el => el.innerText));

    expect(Array.isArray(projectTitles)).toBe(true);
    expect(projectTitles.length).toBeGreaterThan(0);
  });
});
