module.exports = {
  server: {
    command: 'npm run dev',
    port: 1313,
    launchTimeout: 100000
  },
  launch: {
    headless: false
  },
  browser: process.env.PUPPETEER_BROWSER || 'chromium'
}
