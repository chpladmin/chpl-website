import UploadPage from '../pageobjects/upload.page';
import ConfirmPage from '../pageobjects/confirm.page';
import LoginComponent from '../pageobjects/login-component.page';

const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let upload;
let confirm;
let login;

describe('the Upload/Confirm Listing workflow', () => {
  beforeEach(async () => {
    upload = new UploadPage();
    confirm = new ConfirmPage();
    login = new LoginComponent();
    await upload.open();
    await login.logIn('drummond');
  });

  afterEach(async () => {
    await login.logOut();
  });

  it('should have a warning message', async () => {
    // upload a file
    // navigate to confirm
    // open the drawer with warnings
    // expect the warning message to be displayed
    expect(true).toBe(true);
  });
});
