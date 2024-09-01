async function assertTitlesExist(tag = 'h1') {
  const titles = await page.$$eval(tag, elements => elements.map(el => el.innerText));

  expect(Array.isArray(titles)).toBe(true);
  expect(titles.length).toBeGreaterThan(0);
}

module.exports = {
  assertTitlesExist
}
