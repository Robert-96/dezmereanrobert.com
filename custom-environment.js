// Temporary workaround for "TypeError: global.context.isIncognito is not a function" error.
// Remove after the issue https://github.com/argos-ci/jest-puppeteer/issues/586 is resolved.

const PuppeteerEnvironment = require("jest-environment-puppeteer");

class CustomEnvironment extends PuppeteerEnvironment {
  async setup() {
    await super.setup();

    if (this.global.context.isIncognito === undefined) {
      this.global.context.isIncognito = () => false;
    }
  }
}

module.exports = CustomEnvironment;
