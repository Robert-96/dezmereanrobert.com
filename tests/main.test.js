describe('Main Page', () => {
  beforeAll(async () => {
    await page.goto(PATH);
  });

  it('should have the correct title', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).toMatch('Dezmerean Robert\'s Blog');
  });

  it('should have the correct heading', async () => {
    try {
      const pageHeading = await page.$eval('h1', el => el.innerText);
      expect(pageHeading).toBe('Featured Posts');
    } catch (error) {
      throw new Error('Failed to find or evaluate the page heading.');
    }
  });
});
