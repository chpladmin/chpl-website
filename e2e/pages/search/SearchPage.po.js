import BasePage from '../../utilities/basePage';
const config = require('../../config/mainConfig.js');

const homepageElements = {
    chplResource: '#resource-toggle',
    overview: '=Overview',
}

class SearchPage extends BasePage {
    open () {
        super.open(config.baseUrl);
    }

    get chplResourceButton (){
        return $(homepageElements.chplResource);
    }

    get overviewPage (){
        return $(homepageElements.overview);
    }

    gotoResourcePage () {
        this.chplResourceButton.click();
        this.overviewPage.click();
        return this;
    }
}

module.exports = new SearchPage();
