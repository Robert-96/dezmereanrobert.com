const data = require('./data.js')

describe('Navigation', () => {
  data.urls.forEach(url => {
    describe(url.title, () => {
      beforeAll(async () => {
        await page.goto(url.path);
      });

      it('should have the nav bar', async () => {
        const navText = await page.$eval('nav', el => el.innerText);

        expect(navText).toMatch('Dezmerean Robert');
      })
    })
  });
})
