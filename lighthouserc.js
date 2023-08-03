module.exports = {
  ci: {
    collect: {
      staticDistDir: './public/',
      maxAutodiscoverUrls: 10
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
