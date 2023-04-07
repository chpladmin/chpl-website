import ActionBarComponent from '../../../../components/action-bar/action-bar.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';

import QmsStandardPage from './qms-standard.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new QmsStandardPage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the qms standard page', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
      await page.navigate('qms-standards');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add, edit and delete qms standards', async () => {
      const name = `0Test - ${Date.now()}`;
      const newName = `1Test - ${Date.now()}`;
      const initialCount = (await page.getData()).length;
      await (await page.addButton).click();
      await (await page.itemName).setValue(name);
      await action.save();
      await browser.waitUntil(async () => (await page.getData()).length > initialCount);
      await expect(await (await page.dataTable).getText()).toContain(name);
      await page.editItem(name);
      await page.setValue(newName);
      await action.save();
      browser.waitUntil(async () => (await (await $$(page.dataTable)).getText()).not.toContain(name));
      await expect(await (await page.dataTable).getText()).toContain(newName);
      await page.editItem(newName);
      await action.delete();
      await action.clickYesToConfirm();
      await (browser.waitUntil(async () => (await page.getData()).length === initialCount));
      await expect(await (await page.dataTable).getText()).not.toContain(newName);
    });
  });
});
