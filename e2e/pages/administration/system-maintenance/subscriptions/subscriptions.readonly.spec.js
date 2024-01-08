import ActionBarComponent from '../../../../components/action-bar/action-bar.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';

import SubscriptionsPage from './subscriptions.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new SubscriptionsPage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the Subscriptions component', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
      await page.navigate('subscriptions');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should have table headers in a defined order', async () => {
      const expectedHeaders = ['Email', 'Creation Date', 'Role', 'Subject'];
      const actualHeaders = await page.getTableHeaders();
      await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
      await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
    });
  });
});
