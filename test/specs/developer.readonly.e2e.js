import DeveloperPage from '../pageobjects/developer.page';
import LoginComponent from '../pageobjects/login-component.page';

let login;
let page;

describe('the Developer page for "gMed, Inc."', () => {
  beforeEach(async () => {
    page = new DeveloperPage();
    await page.open(1614);
  });

  it('should have a title', async () => {
    await expect(page.title).toHaveText('gMed, Inc.');
  });

  it('should not have the edit button for anonymous users', async () => {
    await expect(page.editDeveloperButton).not.toBeExisting();
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('onc');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have the edit button for ASTP users', async () => {
      await expect(page.editDeveloperButton).toBeExisting();
    });
  });

  describe('when logged in as ONC-ACB', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('drummond');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have the edit button for ONC-ACB users', async () => {
      await expect(page.editDeveloperButton).toBeExisting();
    });
  });
});
