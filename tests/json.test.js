describe('JSON', () => {
  let payload;

  beforeAll(async () => {
    const response = await page.goto(`${PATH}/posts/index.json`);
    if (!response.ok()) {
      throw new Error(`Failed to fetch JSON data. Status: ${response.status()}`);
    }

    const text = await page.$eval('*', el => el.innerText);
    payload = JSON.parse(text);
  });

  it('should contain a list of posts', async () => {
    expect(payload).toBeDefined();
    expect(Array.isArray(payload.posts)).toBe(true);
    expect(payload.posts.length).toBeGreaterThan(0);
  });

  it('should have valid properties for each post', async () => {
    payload.posts.forEach(post => {
      expect(post.url).toMatch(PATH);
      expect(post.title).toBeDefined();
      expect(post.subtitle).toBeDefined();
      expect(post.date).toBeDefined();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(post.tags.length).toBeGreaterThan(0);
    });
  });
});
