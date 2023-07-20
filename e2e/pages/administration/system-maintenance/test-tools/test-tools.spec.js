import ActionBarComponent from '../../../../components/action-bar/action-bar.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';

import TestToolsPage from './test-tools.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new TestToolsPage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the Test Tools component', () => {
  describe('when logged in as ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await page.open();
      await page.navigate('test-tools');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add and edit Test Tools', async () => {
      const toolValue = `1TestTool - ${Date.now()}`;
      const newToolValue = `2TestTool - ${Date.now()}`;
      const initialCount = (await page.getData()).length;
      await (await page.addButton).click();
      await (await page.citation).setValue('Citation-01-TestTool');
      await (await page.itemName).setValue(toolValue);
      await (await page.criterionSelector).click();
      await browser.keys(['ArrowDown', 'ArrowDown', 'Enter']);
      await (await page.ruleSelector).click();
      await browser.keys(['ArrowDown', 'ArrowDown','ArrowDown', 'ArrowDown', 'Enter']);
      await (await page.testToolStartDay).click();
      await browser.keys(['ArrowUp', 'Tab','ArrowUp', 'Tab','ArrowUp', 'Tab', 'Tab']);
      await (await page.testToolEndDay).click();
      await browser.keys(['ArrowDown', 'Tab','ArrowDown', 'Tab','ArrowDown', 'Tab', 'Tab']);
      await action.save();
      await browser.waitUntil(async () => (await page.getData()).length > initialCount);
      await expect(await (await page.dataTable).getText()).toContain(toolValue);
      await page.editItem(toolValue);
      await page.setValue(newToolValue);
      await action.save();
      browser.waitUntil(async () => (await (await $$(page.dataTable)).getText()).not.toContain(toolValue));
      await expect(await (await page.dataTable).getText()).toContain(newToolValue);
    });
  });
});
