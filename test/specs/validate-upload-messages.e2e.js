import UploadListingPage from '../pageobjects/upload-listing.page';
import ConfirmPage from '../pageobjects/confirm.page';
import LoginComponent from '../pageobjects/login-component.page';

import listings from './data/listing-upload.data';

let upload;
let confirm;
let login;

describe('the Upload/Confirm Listing workflow', () => {
  beforeEach(async () => {
    upload = new UploadListingPage();
    confirm = new ConfirmPage();
    login = new LoginComponent();
    await upload.open();
    await login.logIn('drummond');
  });

  afterEach(async () => {
    if (await confirm.actionBarMessagesCloseButton.isDisplayed()) {
      await confirm.actionBarMessagesCloseButton.click();
    }
    await login.logOut();
  });

  listings.forEach(({
    chplProductNumber,
    fileName,
    expectedErrors,
    expectedWarnings,
  }) => {
    it(`should have ${expectedErrors.length} specific errors and ${expectedWarnings.length} specific warnings for ${chplProductNumber}`, async () => {
      await upload.uploadListing(fileName);
      await confirm.open();
      await confirm.waitForPendingListingToBecomeClickable(chplProductNumber);
      if (expectedErrors.length > 0 || expectedWarnings.length > 0) {
        await confirm.openDrawer(chplProductNumber);
        if (expectedErrors.length > 0) {
          await expectedErrors.forEach(async (error) => {
            await expect(confirm.actionBarErrors).toHaveTextContaining(error);
          });
        }
        if (expectedWarnings.length > 0) {
          await expectedWarnings.forEach(async (warning) => {
            await expect(confirm.actionBarWarnings).toHaveTextContaining(warning);
          });
        }
      }
    });
  });
});
