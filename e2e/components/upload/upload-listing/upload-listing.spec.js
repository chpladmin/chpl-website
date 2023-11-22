import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadListingComponent from './upload-listing.po';
import inputs from './upload-listing-dp';

let hooks;
let loginComponent;
let upload;

beforeEach(async () => {
  upload = new UploadListingComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/administration/upload');
});

describe('when uploading listings', () => {
  inputs.forEach((input) => {
    const { message, path, testName } = input;

    it(`shows ${message} status of upload: ${testName}`, () => {
      loginComponent.logIn('acb');
      upload.uploadListing(path);
      hooks.waitForSpinnerToDisappear();
      expect(upload.uploadResults).toHaveTextContaining(message);
      upload.clearResults();
      browser.reloadSession();
    });
  });
});
