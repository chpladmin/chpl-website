import UploadListingComponent from './upload-listing.po';
import LoginComponent from '../../login/login.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../toast/toast.po';

let hooks;
let loginComponent;
let toast;
let uploadListingComponent;

const inputs = require('./upload-listing-beta-dp');

beforeEach(async () => {
  uploadListingComponent = new UploadListingComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  await hooks.open('#/administration/upload');
});

describe('When ONC-ACB uploads - ', () => {
  if (process.env.ENV !== 'stage') {
    beforeEach(() => {
      loginComponent.logIn('acb');
    });

    afterEach(() => {
      hooks.waitForSpinnerToDisappear();
      toast.clearAllToast();
      loginComponent.logOut();
    });

    inputs.forEach((input) => {
      const { testName } = input;
      const { path } = input;
      const { message } = input;

      it(`${testName} - shows ${message} status of upload`, () => {
        uploadListingComponent.uploadListingBeta(path);
        browser.waitUntil(() => toast.toastTitle.isDisplayed());
        expect(toast.toastTitle.getText()).toBe(message);
      });
    });
  }
});
