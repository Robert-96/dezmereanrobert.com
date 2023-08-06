describe('About Page', () => {
  beforeAll(async () => {
    await page.goto(`${PATH}/about`);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();

    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
    expect(pageTitle).toMatch('About Me');
  });

  it('should have the correct heading', async () => {
    const pageHeading = await page.$eval('h1', el => el.innerText);

    expect(pageHeading).toBe('About Me');
  });
});
