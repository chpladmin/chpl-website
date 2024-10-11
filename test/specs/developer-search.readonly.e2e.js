import DeveloperSearchPage from '../pageobjects/developer-search.page';
import LoginComponent from '../pageobjects/login-component.page';

const { expect } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

let login;
let page;

describe('the Developer Search page', () => {
  beforeEach(async () => {
    page = new DeveloperSearchPage();
    await page.open();
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['Developer', 'Developer Code', 'ONC-ACB for active Listings'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should not have the compose message button for anonymous users', async () => {
    await expect(page.composeMessageButton).not.toBeExisting();
  });

  it('should have the Download Developers button for anonymous users', async () => {
    await expect(page.downloadDevelopersButton).toBeExisting();
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('onc');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have the compose message button for ONC users', async () => {
      await expect(page.composeMessageButton).toBeExisting();
    });

    it('should have the Download Developers button for ONC users', async () => {
      await expect(page.downloadDevelopersButton).toBeExisting();
    });
  });

  describe('when logged in as ACB', () => {
    beforeEach(async () => {
      login = new LoginComponent();
      await login.logIn('drummond');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should NOT have the compose message button for ACB users', async () => {
      await expect(page.composeMessageButton).not.toBeExisting();
    });

    it('should have the Download Developers button for ACB users', async () => {
      await expect(page.downloadDevelopersButton).toBeExisting();
    });
  });
});
