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
  if(process.env.ENV !== 'stage') {
    beforeEach(function () {
      loginComponent.logIn('acb');
    });

    afterEach(function () {
      hooks.waitForSpinnerToDisappear();
      toast.clearAllToast();
      loginComponent.logOut();
    });

    inputs.forEach(input => {
      let testName = input.testName;
      let path = input.path;
      let message = input.message;

      it(`${testName} - shows ${message} status of upload`, () => {
        uploadListingComponent.uploadListingBeta(path);
        browser.waitUntil( () => toast.toastTitle.isDisplayed());
        assert.equal(toast.toastTitle.getText(), message);
      });
    });
  }
});
