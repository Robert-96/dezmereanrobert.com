module.exports = {
  server: {
    command: 'npm run dev',
    port: 1313,
    launchTimeout: 100000
  },
  launch: {
    headless: process.env.PUPPETEER_HEADLESS || 'new'
  },
  browser: process.env.PUPPETEER_BROWSER || 'chromium'
}
