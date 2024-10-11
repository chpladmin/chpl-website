import Page from './page.es6';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class ConfirmPage extends Page {
  constructor() {
    super();
    this.name = 'ConfirmPage';
    this.elements = {
      ...this.elements,
    };
  }

  open(path) {
    return super.open('administration/confirm/listings');
  }
}

export default ConfirmPage;
