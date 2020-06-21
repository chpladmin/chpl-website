import BasePage from "./BasePage";
const config = require("../config/mainConfig.js");

const homepageElements= {
  chplResource: '#resource-toggle',
  overview : '=Overview'
}

class homePage extends BasePage {
  open() {
    super.open(config.baseUrl);
  }

  get chplResource(){
    return $(homepageElements.chplResource);
  }

  get overview(){
    return $(homepageElements.overview);
  }

  gotoResourcePage() {
    this.chplResource.click();
    this.overview.click();
    return this;
  }
}

module.exports = new homePage();
