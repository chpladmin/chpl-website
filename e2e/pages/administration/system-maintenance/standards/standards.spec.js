import ActionBarComponent from '../../../../components/action-bar/action-bar.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';
import standardsPage from './standards.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new standardsPage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the Standards component', () => {
  describe('when logged in as ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await page.open();
      await page.navigate('standards');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add and edit Standards', async () => {
      const standardsValue = `1Standards - ${Date.now()}`;
      const newstandardsValue = `2Standards - ${Date.now()}`;
      const initialCount = (await page.getData()).length;
      await (await page.addButton).click();
      await (await page.itemName).setValue(standardsValue);
      await (await page.citation).setValue('Citation-01-Standards');
      await (await page.standardStartDay).click();
      await browser.keys(['ArrowUp', 'Tab','ArrowUp', 'Tab','ArrowUp']);
      await (await page.standardReqDay).click();
      await browser.keys(['ArrowUp', 'Tab','ArrowUp', 'Tab','ArrowUp']);
      await (await page.ruleSelector).click();
      await browser.keys(['ArrowDown', 'ArrowDown','ArrowDown', 'ArrowDown', 'Enter']);
      await (await page.criterionSelector).click();
      await browser.keys(['ArrowDown','Enter']);
      await (await page.additionalInformation).setValue('Additional-Information-01');
      await action.save();
      await browser.waitUntil(async () => (await page.getData()).length > initialCount);
      await expect(await (await page.dataTable).getText()).toContain(standardsValue);
      await page.editItem(standardsValue);
      await page.setValue(newstandardsValue);
      await action.save();
      browser.waitUntil(async () => (await (await $$(page.dataTable)).getText()).not.toContain(standardsValue));
      await expect(await (await page.dataTable).getText()).toContain(newstandardsValue);
      });
  });
});
