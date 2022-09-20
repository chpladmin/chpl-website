import ActionBarComponent from '../action-bar/action-bar.async.po';
import LoginComponent from '../login/login.po';
import { open } from '../../utilities/hooks.async';
import SystemMaintenancePage from '../../pages/administration/system-maintenance/system-maintenance.po';

import AnnouncementsComponent from './announcements.po';

let login;
let page;
let component;
let action;

beforeEach(async () => {
  page = new SystemMaintenancePage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  component = new AnnouncementsComponent();
  await open('#/resources/overview');
});

describe('the announcements component', () => {
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

    it('should be able to add a new announcement', async () => {
      const text = `Test - ${Date.now()}`;
      const initialCount = (await component.getAnnouncements()).length;
      await (await component.addAnnouncementButton).click();
      await (await component.announcementTitle).setValue('Test');
      await (await component.announcementText).setValue(text);
      await (await component.announcementEndDateTime).click();
      await (await component.announcementEndDateTime).keys(['Tab', 'Tab', 'ArrowUp']);
      await (await component.isPublicToggle).click();
      await action.save();
      await browser.waitUntil(async () => (await component.getAnnouncements()).length > initialCount);
      await expect(await (await component.announcementsTable).getText()).toContain(text);
    });
  });
});
