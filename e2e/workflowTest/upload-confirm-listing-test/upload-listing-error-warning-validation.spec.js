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

const validListingId = '15.04.04.1722.AQA4.03.01.1.200620';
const invalidDataInputs = require('./dataProviders/upload-listing-error-warning-validation-dp');
const invalidMeasureInputs = require('./dataProviders/upload-listing-error-warning-validation-measures-dp');
const invalidOptionalStandardInputs = require('./dataProviders/upload-listing-error-warning-validation-optional-standards-dp');
const allInvalidPendingDataToCheck = invalidDataInputs.concat(invalidMeasureInputs, invalidOptionalStandardInputs);

const uploadFileAndWaitForListingsToBeProcessed = (filename, listingIds) => {
  hooks.open('#/administration/upload');
  uploadListingComponent.uploadListingBeta(filename);
  browser.waitUntil(() => toast.toastTitle.isDisplayed());
  toast.clearAllToast();
  hooks.open('#/administration/confirm/listings');
  listingIds.forEach((listingId) => {
    confirmPage.waitForPendingListingToBecomeClickable(listingId);
  });
};

if (process.env.ENV !== 'stage') {
  beforeAll(() => {
    confirmPage = new ConfirmPage();
    uploadListingComponent = new UploadListingComponent();
    loginComponent = new LoginComponent();
    hooks = new Hooks();
    toast = new ToastComponent();
    hooks.open('#/administration/upload');
    loginComponent.logIn('admin');

    let itemsToUpload = [
      {
        file: '../../../resources/upload-listing-beta/2015_InvalidData.csv',
        listingIds: invalidDataInputs.map(item => item.listingId),
      },
      {
        file: '../../../resources/upload-listing-beta/2015_Measures.csv',
        listingIds: invalidMeasureInputs.map(item => item.listingId),
      },
      {
        file: '../../../resources/upload-listing-beta/2015_OptionalStandards.csv',
        listingIds: invalidOptionalStandardInputs.map(item => item.listingId),
      },
      {
        file: '../../../resources/listings/2015_v19_AQA4.csv',
        listingIds: [validListingId],
      }
    ];

    itemsToUpload.forEach((item) => {
      uploadFileAndWaitForListingsToBeProcessed(item.file, item.listingIds);
    });
  });

  allInvalidPendingDataToCheck.forEach((input) => {
    const { listingId } = input;
    const { expectedErrors } = input;
    const { expectedWarnings } = input;

    describe(`When admin uploads a listing with CHPL ID ${listingId} that has invalid inputs in various fields`, () => {
      beforeEach(() => {
        hooks.open('#/administration/confirm/listings');
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
    });
  });

  describe('User inspects uploaded listing with valid CHPL ID', () => {
    beforeEach(() => {
      hooks.open('#/administration/confirm/listings');
    });

    it('should not show any error messages', () => {
      confirmPage.gotoPendingListingPage(validListingId);
      expect(confirmPage.errorOnInspect.length).toBe(0);
    });
  });
}
