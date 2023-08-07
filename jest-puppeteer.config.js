module.exports = {
  server: {
    command: 'npm run test:server',
    port: 1414,
    launchTimeout: 100000
  },
  launch: {
    headless: process.env.PUPPETEER_HEADLESS || 'new'
  },
  browser: process.env.PUPPETEER_BROWSER || 'chromium'
}
