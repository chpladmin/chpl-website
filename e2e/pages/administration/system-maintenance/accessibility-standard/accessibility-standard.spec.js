import ActionBarComponent from '../../../../components/action-bar/action-bar.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks';

import AccessibilityStandard from './accessibility-standard.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new AccessibilityStandard();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the accessibility standard', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
      await page.navigate('accessibility-standards');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add a new accessibility standard and then edit it', async () => {
      const name = `1Test - ${Date.now()}`;
      const editName = `2Test - ${Date.now()}`;
      const initialCount = (await page.getData()).length;
      await (await page.addButton).click();
      await (await page.itemName).setValue(name);
      await action.save();
      await browser.waitUntil(async () => (await page.getData()).length > initialCount);
      await expect(await (await page.dataTable).getText()).toContain(name);
      await page.editItem(name);
      await page.setValue(editName);
      await action.save();
      browser.waitUntil(async () => (await (await $$(page.dataTable)).getText()).not.toContain(name));
      await expect(await (await page.dataTable).getText()).toContain(editName);
    });
  });
});
