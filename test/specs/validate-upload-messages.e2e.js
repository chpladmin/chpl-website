import UploadListingPage from '../pageobjects/upload-listing.page';
import ConfirmPage from '../pageobjects/confirm.page';
import LoginComponent from '../pageobjects/login-component.page';

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
    await confirm.actionBarMessagesCloseButton.click();
    await login.logOut();
  });

  it('should have a warning message', async () => {
    await upload.uploadListing('test/resources/HTI-1-criteria.csv');
    await confirm.open();
    await confirm.waitForPendingListingToBecomeClickable('15.02.04.2701.MVL1.12.00.1.231020');
    await confirm.openDrawer('15.02.04.2701.MVL1.12.00.1.231020');
    await expect(confirm.actionBarWarnings).toHaveText(expect.stringContaining('This listing has a product name of \'Compulink Healthcare Solutions\', but the developer Compulink Healthcare Solutions has a similarly named product \'Compulink Advantage\'. Should the listing belong to that product instead?'));
  });
});
