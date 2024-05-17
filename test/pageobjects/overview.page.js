const { $ } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies
const Page = require('./page');

class OverviewPage extends Page {
  open () {
    return super.open('resources/overview');
  }

  get acbatlTable () {
    return $('h2=ONC-ACB and ONC-ATL Information');
  }
}

module.exports = new OverviewPage();
