import UploadListingComponent from './upload-listing.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../toast/toast.po';

let hooks, loginComponent, toast,uploadListingComponent;

const inputs = require('./upload-listing-beta-dp');

beforeEach(async () => {
  uploadListingComponent = new UploadListingComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  await hooks.open('#/administration/upload');
});

describe('When ONC-ACB uploads - ', () => {
  beforeEach(function () {
    loginComponent.logIn('acb');
  });

  afterEach(function () {
    toast.clearAllToast();
    loginComponent.logOut();
  });

  inputs.forEach(input => {
    let testName = input.testName;
    let path = input.path;
    let message = input.message;

    it(`${testName} - shows ${message} status of upload`, () => {
      browser.pause(2000); //Finding beta component exist or not doesnt work without this pause
      if (uploadListingComponent.uploadBetaButton.isDisplayed()) {
        uploadListingComponent.uploadListingBeta(path);
        browser.waitUntil( () => toast.toastTitle.isDisplayed());
        assert.equal(toast.toastTitle.getText(), message);
      }
    });
  });
});
