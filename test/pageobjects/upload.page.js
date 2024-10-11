import Page from './page.es6';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class UploadPage extends Page {
  constructor() {
    super();
    this.name = 'UploadPage';
    this.elements = {
      ...this.elements,
    };
  }

  open(path) {
    return super.open('administration/upload');
  }
}

export default UploadPage;
