import ActionBarComponent from '../../../../components/action-bar/action-bar.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';

import Announcements from './announcements.po';

let login;
let page;
let action;

beforeEach(async () => {
  page = new Announcements();
  action = new ActionBarComponent();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the announcements', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open();
      await page.navigate('announcements');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should be able to add a new announcement and edit it', async () => {
      const text = `1Test - ${Date.now()}`;
      const newText = `2Test - ${Date.now()}`;
      await (await page.addButton).click();
      await (await page.announcementTitle).setValue('Test');
      await (await page.itemName).setValue(text);
      await (await page.announcementEndDateTime).click();
      await (await page.announcementEndDateTime).keys(['Tab', 'Tab', 'ArrowUp']);
      await (await page.isPublicToggle).click();
      await action.save();
      await (browser.waitUntil(async () => (await (page.dataTable)).isDisplayed()));
      await expect(await (await page.dataTable).getText()).toContain(text);
      await page.editItem(text);
      await page.setValue(newText);
      await action.save();
      await (browser.waitUntil(async () => (await (page.dataTable)).isDisplayed()));
      browser.waitUntil(async () => (await (await $$(page.dataTable)).getText()).not.toContain(text));
    });
  });
});
