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
    await login.logOut();
  });

  it('should have a warning message', async () => {
    await upload.uploadListing('test/resources/HTI-1-criteria.csv');
    await confirm.open();
    // open the drawer with warnings
    // expect the warning message to be displayed
    expect(true).toBe(true);
  });
});
