import ActionBarComponent from '../../action-bar/action-bar.async.po';
import LoginComponent from '../../login/login.po';
import { open } from '../../../utilities/hooks.async';
import SystemMaintenancePage from '../../../pages/administration/system-maintenance/system-maintenance.po';

import AccessibilityStandardComponent from './accessibility-standard.po';

let login;
let page;
let component;
let action;

beforeEach(async () => {
  page = new SystemMaintenancePage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  component = new AccessibilityStandardComponent();
  await open('#/resources/overview');
});

describe('the accessibility standard component', () => {
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

    it('should be able to add a new accessibility standard and then edit and delete', async () => {
      const name = `1Test - ${Date.now()}`;
      const editName = `2Test - ${Date.now()}`;
      const updatedName = name + editName;
      const initialCount = (await component.getData()).length;
      await (await component.addButton).click();
      await (await component.name).setValue(name);
      await action.save();
      await browser.waitUntil(async () => (await component.getData()).length > initialCount);
      await expect(await (await component.dataTable).getText()).toContain(name);
      await page.editStandards(name);
      await (await component.name).setValue(editName);
      await action.save();
      await browser.waitUntil(async () => (await component.dataTable).getText().not.toContain(name));
      await expect(await (await component.dataTable).getText()).toContain(updatedName);
      await page.editStandards(updatedName);
      await action.delete();
      await action.clickYesToConfirm();
      await browser.waitUntil(async () => (await component.getData()).length === initialCount);
      await expect(await (await component.dataTable).getText()).not.toContain(updatedName);
    }); 
  });
});
