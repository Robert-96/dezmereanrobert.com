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
    // TODO
  });
});
