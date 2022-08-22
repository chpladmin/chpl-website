import UploadListingComponent from '../../components/upload/upload-listing/upload-listing.po';
import Confirm from '../../pages/administration/confirm/confirm.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';

import { suites } from './suites';

let confirm;
let hooks;
let loginComponent;
let uploadListingComponent;
let actionBar;

if (process.env.ENV !== 'stage') {
  describe('When admin uploads a listing ', () => {
    beforeAll(() => {
      confirm = new Confirm();
      uploadListingComponent = new UploadListingComponent();
      loginComponent = new LoginComponent();
      actionBar = new ActionBarComponent();
      hooks = new Hooks();
      hooks.open('#/administration/upload');
      loginComponent.logIn('admin');
    });

    suites.forEach((suite) => {
      const { file, listings, description } = suite;
      const listingIds = listings.map((item) => item.listingId);

      describe(description, () => {
        beforeEach(() => {
          hooks.open('#/administration/upload');
          uploadListingComponent.uploadFileAndWaitForListingsToBeProcessed(file, listingIds, hooks, confirm);
        });

        listings.forEach((input) => {
          const { listingId, expectedErrors, expectedWarnings } = input;

          it(`${listingId} should have expected messages`, () => {
            hooks.open('#/administration/confirm/listings');
            confirm.gotoPendingListingPage(listingId);
            hooks.waitForSpinnerToDisappear();
            if (expectedErrors.length > 0 || expectedWarnings.length > 0) {
              actionBar.waitForMessages();
            }

            const errorsOnPage = new Set(actionBar.errors.map((item) => item.getText()));
            const warningsOnPage = new Set(actionBar.warnings.map((item) => item.getText()));
            const failures = []
              .concat(expectedErrors.filter((exp) => !errorsOnPage.has(exp)).map((exp) => `Expected to find "${exp}" as an error`))
              .concat(expectedWarnings.filter((exp) => !warningsOnPage.has(exp)).map((exp) => `Expected to find "${exp}" as a warning`))
              .concat([...errorsOnPage].filter((found) => !expectedErrors.includes(found)).map((found) => `Did not expect to find "${found}" as an error`))
              .concat([...warningsOnPage].filter((found) => !expectedWarnings.includes(found)).map((found) => `Did not expect to find "${found}" as a warning`));
            expect(failures.length).toBe(0, `Found or missed items: ${failures.join(', ')}`);
          });
        });
      });
    });
  });
}
