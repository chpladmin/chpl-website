import UploadListingComponent from '../../components/upload/upload-listing/upload-listing.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';

let confirmPage , hooks, loginComponent, toast, uploadListingComponent;
const inputs = require('./dataProviders/chplId-data-validation-dp');
const validListingId = '15.04.04.1722.AQA4.03.01.1.200620';

beforeEach( () => {
  confirmPage = new ConfirmPage();
  uploadListingComponent = new UploadListingComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  hooks.open('#/administration/upload');
  loginComponent.logIn('admin');
});

inputs.forEach(input => {
  let listingId = input.listingId;
  let expectedErrors = input.expectedErrors;

  describe(`User inspects uploaded listing with invalid CHPL ID as ${listingId}`, () => {

    beforeEach(function () {
      browser.pause(2000); //Finding beta component exist or not doesnt work without this pause
      if (uploadListingComponent.chooseUploadListingBetaButton.isExisting()) {
        uploadListingComponent.uploadListingBeta('../../../resources/upload-listing-beta/2015_InvalidData.csv');
        browser.waitUntil( () => toast.toastTitle.isDisplayed());
      }
      hooks.open('#/administration/confirm/listings');
    });

    afterEach(function () {
      loginComponent.logOut();
    });

    it('should show all correct expected error messages', () => {
      confirmPage.gotoPendingListingPage(listingId);
      hooks.waitForSpinnerToDisappear();
      confirmPage.waitForBarMessages();
      let errors = new Set(confirmPage.errorOnInspect.map(item => item.getText()));
      expect(errors.size).toBe(expectedErrors.length);
      let count = 0;
      errors.forEach(err => {
        expectedErrors.forEach(exp => {
          if (err.includes(exp)) {
            count ++;
          }
        });
      });
      expect(count).toBe(expectedErrors.length);
    });
  });
});

describe('User inspects uploaded listing with valid CHPL ID', () => {
  beforeEach(function () {
    hooks.waitForSpinnerToDisappear();
    if (uploadListingComponent.chooseUploadListingBetaButton.isExisting()) {
      uploadListingComponent.uploadListingBeta('../../../resources/listings/2015_v19_AQA4.csv');
      browser.waitUntil( () => toast.toastTitle.isDisplayed());
    }
    hooks.open('#/administration/confirm/listings');
  });

  afterEach(function () {
    loginComponent.logOut();
  });

  it('should not show any error messages', () => {
    confirmPage.gotoPendingListingPage(validListingId);
    expect(confirmPage.errorOnInspect.length).toBe(0);
  });
});
