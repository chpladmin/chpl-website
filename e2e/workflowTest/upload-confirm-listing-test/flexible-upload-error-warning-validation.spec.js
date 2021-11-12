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

const suites = [
  {description: 'with issues in the column headings', file: '../../../resources/upload-listing-beta/2015_BogusColumns.csv', messages: './dataProviders/columns-errors-and-warnings-dp'},
  {description: 'with invalid or missing data ', file: '../../../resources/upload-listing-beta/2015_InvalidAndMissingData.csv', messages: './dataProviders/invalid-formats-errors-and-warnings-dp'},
];
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
  hooks.waitForSpinnerToDisappear();
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

    suites.forEach((suite) => {
      let file = suite.file;
      let invalidInputs = require(suite.messages);
      let listingIds = invalidInputs.map(item => item.listingId);

      /*
        afterAll(() => {
        console.log("IN AFTER");
        rejectListings(listingIds);
        })e
      */;

      describe(suite.description, () => {
        beforeEach(() => {
          console.log("IN BEFORE");
          uploadFileAndWaitForListingsToBeProcessed(file, listingIds);
        });

        invalidInputs.forEach((input) => {
          let { listingId } = input;
          let { expectedErrors } = input;
          let { expectedWarnings } = input;

          it(`${listingId} should have expected messages`, () => {
            console.log("Checking messages for " + listingId);
            hooks.open('#/administration/confirm/listings');
            confirmPage.gotoPendingListingPage(listingId);
            hooks.waitForSpinnerToDisappear();
            confirmPage.waitForBarMessages();

            let errorsOnPage = new Set(confirmPage.errorOnInspect.map((item) => item.getText()));
            let warningsOnPage = new Set(confirmPage.warningOnInspect.map((item) => item.getText()));
            expectedErrors.forEach((exp) => {
              expect(errorsOnPage.has(exp)).toBe(true, `Expected to find "${exp}" on page`);
            });
            errorsOnPage.forEach((found) => {
              expect(expectedErrors.includes(found)).toBe(true, `Did not expect to find "${found}"`);
            });
            expectedWarnings.forEach((exp) => {
              expect(warningsOnPage.has(exp)).toBe(true, `Expected to find "${exp}" on page`);
            });
            warningsOnPage.forEach((found) => {
              expect(expectedWarnings.includes(found)).toBe(true, `Did not expect to find "${found}"`);
            });
          });

          xit(`${listingId} should have expected error messages`, () => {
            console.log("Checking errors for " + listingId);
            hooks.open('#/administration/confirm/listings');
            confirmPage.gotoPendingListingPage(listingId);
            hooks.waitForSpinnerToDisappear();
            confirmPage.waitForBarMessages();

            let errorsOnPage = new Set(confirmPage.errorOnInspect.map((item) => item.getText()));
            //let matchedErrorCount = getMatchedMessageCount(errorsOnPage, expectedErrors);
            expectedErrors.forEach((exp) => {
              expect(errorsOnPage.has(exp)).toBe(true, `Expected to find "${exp}" on page`);
            });
            errorsOnPage.forEach((found) => {
              expect(expectedErrors.includes(found)).toBe(true, `Did not expect to find "${found}"`);
            });
            //expect(matchedErrorCount).toBe(expectedErrors.length);
            //expect(errorsOnPage.size).toBe(expectedErrors.length);
          });

          xit(`${listingId} should have expected warning messages`, () => {
            console.log("Checking warnings for " + listingId);
            hooks.open('#/administration/confirm/listings');
            confirmPage.gotoPendingListingPage(listingId);
            hooks.waitForSpinnerToDisappear();
            confirmPage.waitForBarMessages();

            let warningsOnPage = new Set(confirmPage.warningOnInspect.map((item) => item.getText()));
            //let matchedWarningCount = getMatchedMessageCount(warningsOnPage, expectedWarnings);
            expectedWarnings.forEach((exp) => {
              expect(warningsOnPage.has(exp)).toBe(true, `Expected to find "${exp}" on page`);
            });
            warningsOnPage.forEach((found) => {
              expect(expectedWarnings.includes(found)).toBe(true, `Did not expect to find "${found}"`);
            });
            //expect(matchedWarningCount).toBe(expectedWarnings.length);
            //expect(warningsOnPage.size).toBe(expectedWarnings.length);
          });
        });
      });
    });
  });
}
