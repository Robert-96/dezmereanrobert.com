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

    expect(pageHeading).toBe('Featured Posts');
  });

  it('should be at least one feature post', async () => {
    // TODO
  });
});
