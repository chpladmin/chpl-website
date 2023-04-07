import ActionBarComponent from '../../../../components/action-bar/action-bar.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';

import SvapPage from './svap.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new SvapPage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the svap component', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
      await page.navigate('svaps');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add, edit and delete svaps', async () => {
      const version = `0Test - ${Date.now()}`;
      const newVersion = `1Test - ${Date.now()}`;
      const initialCount = (await page.getData()).length;
      await (await page.addButton).click();
      await (await page.citation).setValue('00-Citation');
      await (await page.itemName).setValue(version);
      await (await page.criterionSelector).click();
      await browser.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await action.save();
      await browser.waitUntil(async () => (await page.getData()).length > initialCount);
      await expect(await (await page.dataTable).getText()).toContain(version);
      await page.editItem(version);
      await page.setValue(newVersion);
      await action.save();
      browser.waitUntil(async () => (await (await $$(page.dataTable)).getText()).not.toContain(version));
      await expect(await (await page.dataTable).getText()).toContain(newVersion);
      await page.editItem(newVersion);
      await action.delete();
      await action.clickYesToConfirm();
      await (browser.waitUntil(async () => (await page.getData()).length === initialCount));
      await expect(await (await page.dataTable).getText()).not.toContain(newVersion);
    });
  });
});
