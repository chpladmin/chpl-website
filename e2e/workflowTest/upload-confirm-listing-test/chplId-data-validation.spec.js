import UploadListingComponent from '../../components/upload/upload-listing/upload-listing.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';

let confirmPage;
let hooks;
let loginComponent;
let toast;
let uploadListingComponent;
const inputs = require('./dataProviders/chplId-data-validation-dp');

const validListingId = '15.04.04.1722.AQA4.03.01.1.200620';

beforeEach(() => {
  confirmPage = new ConfirmPage();
  uploadListingComponent = new UploadListingComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  hooks.open('#/administration/upload');
  loginComponent.logIn('admin');
});

inputs.forEach((input) => {
  const { listingId } = input;
  const { expectedErrors } = input;
  const { expectedWarnings } = input;

  describe(`User uploads a listing with CHPL ID ${listingId} that has invalid inputs in various fields or missing required criteria`, () => {
    if (process.env.ENV !== 'stage') {
      beforeEach(() => {
        uploadListingComponent.uploadListingBeta('../../../resources/upload-listing-beta/2015_InvalidData.csv');
        browser.waitUntil(() => toast.toastTitle.isDisplayed());
        hooks.open('#/administration/confirm/listings');
      });

      afterEach(() => {
        toast.clearAllToast();
        loginComponent.logOut();
      });

      it('should show all expected error messages on pending listing inspect', () => {
        confirmPage.gotoPendingListingPage(listingId);
        hooks.waitForSpinnerToDisappear();
        confirmPage.waitForBarMessages();
        const errors = new Set(confirmPage.errorOnInspect.map((item) => item.getText()));
        expect(errors.size).toBe(expectedErrors.length);
        let count = 0;
        errors.forEach((err) => {
          expectedErrors.forEach((exp) => {
            if (err.includes(exp)) {
              count += 1;
            }
          });
        });
        expect(count).toBe(expectedErrors.length);
      });

      it('should show all correct expected warning messages', () => {
        confirmPage.gotoPendingListingPage(listingId);
        hooks.waitForSpinnerToDisappear();
        confirmPage.waitForBarMessages();
        const warnings = new Set(confirmPage.warningOnInspect.map((item) => item.getText()));
        expect(warnings.size).toBe(expectedWarnings.length);
        let count = 0;
        warnings.forEach((err) => {
          expectedWarnings.forEach((exp) => {
            if (err.includes(exp)) {
              count += 1;
            }
          });
        });
        expect(count).toBe(expectedWarnings.length);
      });
    }
  });
});

describe('User inspects uploaded listing with valid CHPL ID', () => {
  if (process.env.ENV !== 'stage') {
    beforeEach(() => {
      uploadListingComponent.uploadListingBeta('../../../resources/listings/2015_v19_AQA4.csv');
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      hooks.open('#/administration/confirm/listings');
    });

    afterEach(() => {
      toast.clearAllToast();
      loginComponent.logOut();
    });

    it('should not show any error messages', () => {
      confirmPage.gotoPendingListingPage(validListingId);
      expect(confirmPage.errorOnInspect.length).toBe(0);
    });
  }
});
