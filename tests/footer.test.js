const data = require('./data.js')

describe('Footer', () => {
  data.urls.forEach(url => {
    describe(url.title, () => {
      beforeAll(async () => {
        await page.goto(url.path);
      });

      it('should have the footer', async () => {
        const footerText = await page.$eval('footer', el => el.innerText);

        expect(footerText).toMatch('Copyright Dezmerean Robert');
      })
    })
  });
})
