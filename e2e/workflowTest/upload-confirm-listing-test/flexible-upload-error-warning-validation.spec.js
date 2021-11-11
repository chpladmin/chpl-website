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

//const validListingId = '15.04.04.1722.AQA4.03.01.1.200620';
//const invalidDeveloperInputs = require('./dataProviders/developer-errors-and-warnings-dp');
//const invalidCriteriaRelationshipInputs = require('./dataProviders/criteria-relationships-errors-and-warnings-dp');
//const invalidCqmInputs = require('./dataProviders/cqms-errors-and-warnings-dp');
//const invalidSedInputs = require('./dataProviders/sed-errors-and-warnings-dp');
//const invalidMeasureInputs = require('./dataProviders/measures-errors-and-warnings-dp');
//const invalidOptionalStandardInputs = require('./dataProviders/optional-standards-errors-and-warnings-dp');

const uploadFileAndWaitForListingsToBeProcessed = (filename, listingIds) => {
  console.log("Upload file and wait for listings to be processed");
  hooks.open('#/administration/upload');
  console.log('Opened upload page to upload ' + filename);
  uploadListingComponent.uploadListingBeta(filename);
  console.log('uploaded ' + filename);
  browser.waitUntil(() => toast.toastTitle.isDisplayed());
  toast.clearAllToast();
  hooks.open('#/administration/confirm/listings');
  listingIds.forEach((listingId) => {
    confirmPage.waitForPendingListingToBecomeClickable(listingId);
    console.log('Pending listing ' + listingId + ' is clickable!');
  });
};

const rejectListings = (listingIds) => {
  console.log("Reject listings " + listingIds);
  hooks.open('#/administration/confirm/listings');
  listingIds.forEach((listingId) => {
    console.log("Selecting listing " + listingId + " to reject");
    confirmPage.rejectListingCheckbox(listingId);
  });
  confirmPage.rejectButton.click();
  browser.waitUntil(() => toast.toastTitle.isDisplayed());
  toast.clearAllToast();
};

const getMatchedMessageCount = (existingMessages, expectedMessages) => {
  let matchedMessages = 0;
  existingMessages.forEach((existingMessage) => {
    expectedMessages.forEach((expectedMessage) => {
      if (existingMessage.includes(expectedMessage)) {
        matchedMessages++;
      }
    });
  });
  return matchedMessages;  
};

if (process.env.ENV !== 'stage') {
  console.log("NOT STG");
  describe('When admin uploads a listing ', () => {
    beforeAll(() => {
      console.log("BEFORE ALL!");
      confirmPage = new ConfirmPage();
      uploadListingComponent = new UploadListingComponent();
      loginComponent = new LoginComponent();
      hooks = new Hooks();
      toast = new ToastComponent();
      hooks.open('#/administration/upload');
      loginComponent.logIn('admin');
      console.log("LOGGED IN!");
    });

    describe('with issues in the column headings ', () => {
      const file = '../../../resources/upload-listing-beta/2015_BogusColumns.csv';
      const invalidColumnInputs = require('./dataProviders/columns-errors-and-warnings-dp');
      const listingIds = invalidColumnInputs.map(item => item.listingId);

      beforeAll(() => {
        console.log("IN BEFORE");
        uploadFileAndWaitForListingsToBeProcessed(file, listingIds);
      });

      afterAll(() => {
        console.log("IN AFTER");
        rejectListings(listingIds);
      });

      invalidColumnInputs.forEach((input) => {
        const { listingId } = input;
        const { expectedErrors } = input;
        const { expectedWarnings } = input;
    
        it('${listingId} should have expected error messages', () => {
          console.log("Checking errors for " + listingId);
          hooks.open('#/administration/confirm/listings');
          confirmPage.gotoPendingListingPage(listingId);
          hooks.waitForSpinnerToDisappear();
          confirmPage.waitForBarMessages();

          const errorsOnPage = new Set(confirmPage.errorOnInspect.map((item) => item.getText()));
          let matchedErrorCount = getMatchedMessageCount(errorsOnPage, expectedErrors);
          expect(matchedErrorCount).toBe(expectedErrors.length);
          expect(errorsOnPage.size).toBe(expectedErrors.length);
        });

        it('${listingId} should have expected warning messages', () => {
          console.log("Checking warnings for " + listingId);
          hooks.open('#/administration/confirm/listings');
          confirmPage.gotoPendingListingPage(listingId);
          hooks.waitForSpinnerToDisappear();
          confirmPage.waitForBarMessages();

          const warningsOnPage = new Set(confirmPage.warningOnInspect.map((item) => item.getText()));
          let matchedWarningCount = getMatchedMessageCount(warningsOnPage, expectedWarnings);
          expect(matchedWarningCount).toBe(expectedWarnings.length);
          expect(warningsOnPage.size).toBe(expectedWarnings.length);
        });
      });
    });

    describe('with invalid or missing data ', () => {
      const file = '../../../resources/upload-listing-beta/2015_InvalidAndMissingData.csv';
      const invalidDataFormatInputs = require('./dataProviders/invalid-formats-errors-and-warnings-dp');
      const listingIds = invalidDataFormatInputs.map(item => item.listingId);

      beforeAll(() => {
        console.log("IN BEFORE");
        uploadFileAndWaitForListingsToBeProcessed(file, listingIds);
      });

      afterAll(() => {
        console.log("IN AFTER");
        rejectListings(listingIds);
      });

      invalidDataFormatInputs.forEach((input) => {
        const { listingId } = input;
        const { expectedErrors } = input;
        const { expectedWarnings } = input;
    
        it('${listingId} should have expected error messages', () => {
          console.log("Checking errors for " + listingId);
          hooks.open('#/administration/confirm/listings');
          confirmPage.gotoPendingListingPage(listingId);
          hooks.waitForSpinnerToDisappear();
          confirmPage.waitForBarMessages();

          const errorsOnPage = new Set(confirmPage.errorOnInspect.map((item) => item.getText()));
          let matchedErrorCount = getMatchedMessageCount(errorsOnPage, expectedErrors);
          expect(matchedErrorCount).toBe(expectedErrors.length);
          expect(errorsOnPage.size).toBe(expectedErrors.length);
        });

        it('${listingId} should have expected warning messages', () => {
          console.log("Checking warnings for " + listingId);
          hooks.open('#/administration/confirm/listings');
          confirmPage.gotoPendingListingPage(listingId);
          hooks.waitForSpinnerToDisappear();
          confirmPage.waitForBarMessages();

          const warningsOnPage = new Set(confirmPage.warningOnInspect.map((item) => item.getText()));
          let matchedWarningCount = getMatchedMessageCount(warningsOnPage, expectedWarnings);
          expect(matchedWarningCount).toBe(expectedWarnings.length);
          expect(warningsOnPage.size).toBe(expectedWarnings.length);
        });
      });
    });

  });
}
