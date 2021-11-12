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

if (process.env.ENV !== 'stage') {
  describe('When admin uploads a listing ', () => {
    beforeAll(() => {
      confirmPage = new ConfirmPage();
      uploadListingComponent = new UploadListingComponent();
      loginComponent = new LoginComponent();
      hooks = new Hooks();
      toast = new ToastComponent();
      hooks.open('#/administration/upload');
      loginComponent.logIn('admin');
    });

    suites.forEach((suite) => {
      const { file, listings, description } = suite;
      const listingIds = listings.map((item) => item.listingId);

      describe(description, () => {
        beforeEach(() => {
          hooks.open('#/administration/upload');
          uploadListingComponent.uploadFileAndWaitForListingsToBeProcessed(file, listingIds, toast, hooks, confirmPage);
        });

        listings.forEach((input) => {
          const { listingId, expectedErrors, expectedWarnings } = input;

          it(`${listingId} should have expected messages`, () => {
            hooks.open('#/administration/confirm/listings');
            confirmPage.gotoPendingListingPage(listingId);
            hooks.waitForSpinnerToDisappear();
            confirmPage.waitForBarMessages();

            const errorsOnPage = new Set(confirmPage.errorOnInspect.map((item) => item.getText()));
            const warningsOnPage = new Set(confirmPage.warningOnInspect.map((item) => item.getText()));
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
