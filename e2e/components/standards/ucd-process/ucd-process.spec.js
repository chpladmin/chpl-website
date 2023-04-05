import ActionBarComponent from '../../action-bar/action-bar.async.po';
import LoginComponent from '../../login/login.po';
import { open } from '../../../utilities/hooks.async';
import SystemMaintenancePage from '../../../pages/administration/system-maintenance/system-maintenance.po';

import UcdProcessComponent from './ucd-process.po';

let login;
let page;
let component;
let action;

beforeEach(async () => {
  page = new SystemMaintenancePage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  component = new UcdProcessComponent();
  await open('#/resources/overview');
});

describe('the ucd process component', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
      await page.navigate('ucd-processes');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add, edit and delete UCD processes', async () => {
      const name = `0Test - ${Date.now()}`;
      const newName = `1Test - ${Date.now()}`;
      const nameAfterEdit = name + newName;
      const initialCount = (await component.getData()).length;
      await (await component.addButton).click();
      await (await component.name).setValue(name);
      await action.save();
      await browser.waitUntil(async () => (await component.getData()).length > initialCount);
      await expect(await (await component.dataTable).getText()).toContain(name);
      await page.editItem(name);
      await (await component.name).setValue(newName);
      await action.save();
      await browser.waitUntil(async () => (await component.getData).getText()).not.toContain(name);
      await expect(await (await component.dataTable).getText()).toContain(newName);
      await page.editItem(nameAfterEdit);
      await action.delete();
      await action.clickYesToConfirm();
      await (browser.waitUntil(async () => (await component.getData()).length === initialCount));
      await expect(await (await component.dataTable).getText()).not.toContain(newName);
    });
  });
});
