import UploadListingComponent from '../../components/upload/upload-listing/upload-listing.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';

import { suites } from './suites';

let confirmPage;
let hooks;
let loginComponent;
let toast;
let uploadListingComponent;

/*
const suites = [
  {description: 'with issues in the column headings', file: '../../../resources/upload-listing-beta/2015_BogusColumns.csv', messages: './dataProviders/columns-errors-and-warnings-dp'},
  {description: 'with invalid or missing data ', file: '../../../resources/upload-listing-beta/2015_InvalidAndMissingData.csv', messages: './dataProviders/invalid-formats-errors-and-warnings-dp'},
];
*/

//const validListingId = '15.04.04.1722.AQA4.03.01.1.200620';
//const invalidDeveloperInputs = require('./dataProviders/developer-errors-and-warnings-dp');
//const invalidCriteriaRelationshipInputs = require('./dataProviders/criteria-relationships-errors-and-warnings-dp');
//const invalidCqmInputs = require('./dataProviders/cqms-errors-and-warnings-dp');
//const invalidSedInputs = require('./dataProviders/sed-errors-and-warnings-dp');
//const invalidMeasureInputs = require('./dataProviders/measures-errors-and-warnings-dp');
//const invalidOptionalStandardInputs = require('./dataProviders/optional-standards-errors-and-warnings-dp');

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
      let { file, listings, description } = suite;
      const listingIds = listings.map(item => item.listingId);

      describe(description, () => {
        beforeEach(() => {
          console.log("IN BEFORE");
          hooks.open('#/administration/upload');
          uploadListingComponent.uploadFileAndWaitForListingsToBeProcessed(file, listingIds, toast, hooks, confirmPage);
        });

        listings.forEach((input) => {
          let { listingId, expectedErrors, expectedWarnings } = input;

          it(`${listingId} should have expected messages`, () => {
            console.log("Checking messages for " + listingId);
            hooks.open('#/administration/confirm/listings');
            confirmPage.gotoPendingListingPage(listingId);
            hooks.waitForSpinnerToDisappear();
            confirmPage.waitForBarMessages();

            const errorsOnPage = new Set(confirmPage.errorOnInspect.map((item) => item.getText()));
            const warningsOnPage = new Set(confirmPage.warningOnInspect.map((item) => item.getText()));
            let failures = []
                .concat(expectedErrors.filter((exp) => !errorsOnPage.has(exp)).map((exp) => `Expected to find "${exp}" as an error`))
                .concat(expectedWarnings.filter((exp) => !warningsOnPage.has(exp)).map((exp) => `Expected to find "${exp}" as a warning`))
                .concat([...errorsOnPage].filter((found) => !expectedErrors.includes(found)).map((found) => `Did not expect to find "${found}" as an error`))
                .concat([...warningsOnPage].filter((found) => !expectedWarnings.includes(found)).map((found) => `Did not expect to find "${found}" as a warning`))
            ;
            expect(failures.length).toBe(0, `Found or missed items: ${failures.join(', ')}`);
          });
        });
      });
    });
  });
}
