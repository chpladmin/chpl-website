import ActionBarComponent from '../../../../components/action-bar/action-bar.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks';

import FunctionalitiesTestedPage from './functionalities-tested.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new FunctionalitiesTestedPage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the Functionalities Tested component', () => {
  describe('when logged in as ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await page.open();
      await page.navigate('functionalities-tested');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should have Details button', async () => {
      await expect(await (await page.detailsButton).isDisplayed()).toBe(true);
    });

    it('should be able to add and edit Functionality Tested', async () => {
      const funcTestedValue = `1FunctionalityTested - ${Date.now()}`;
      const newfuncTestedValue = `2FunctionalityTested - ${Date.now()}`;
      const initialCount = (await page.getData()).length;
      await (await page.addButton).click();
      await (await page.itemName).setValue(funcTestedValue);
      await (await page.citation).setValue('Citation-01-FunctionalityTested');
      await (await page.funtionalityTestedStartDay).click();
      await browser.keys(['ArrowUp', 'Tab','ArrowUp', 'Tab','ArrowUp']);
      await (await page.funtionalityTestedReqDay).click();
      await browser.keys(['ArrowUp', 'Tab','ArrowUp', 'Tab','ArrowUp']);
      await (await page.ruleSelector).click();
      await browser.keys(['ArrowDown', 'ArrowDown','ArrowDown', 'ArrowDown', 'Enter']);
      await (await page.practiceType).click();
      await browser.keys(['ArrowDown', 'Enter']);
      await (await page.criterionSelector).click();
      await browser.keys(['ArrowUp','Enter']);
      await (await page.additionalInformation).setValue('Additional-Information-01');
      await action.save();
      await browser.waitUntil(async () => (await page.getData()).length > initialCount);
      await expect(await (await page.dataTable).getText()).toContain(funcTestedValue);
      await page.editItem(funcTestedValue);
      await page.setValue(newfuncTestedValue);
      await action.save();
      browser.waitUntil(async () => (await (await $$(page.dataTable)).getText()).not.toContain(funcTestedValue));
      await expect(await (await page.dataTable).getText()).toContain(newfuncTestedValue);
    });
  });
});
