describe('Main', () => {
  beforeAll(async () => {
    await page.goto(PATH);
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Dezmerean Robert\'s Blog');
  });
});
