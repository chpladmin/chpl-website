import LoginComponent from '../../login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import UploadListingComponent from './upload-listing.po';
import inputs from './upload-listing-beta-dp';

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
  beforeEach(() => {
    loginComponent.logIn('acb');
  });

  afterEach(() => {
    hooks.waitForSpinnerToDisappear();
    loginComponent.logOut();
  });

  inputs.forEach((input) => {
    const { message, path, testName } = input;

    it(`shows ${message} status of upload: ${testName}`, () => {
      upload.uploadListing(path);
      expect(upload.uploadMessage(path.split('/').pop())).toHaveTextContaining(message);
    });
  });
});
