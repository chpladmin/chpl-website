import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import LoginComponent from '../../../components/login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import AnnouncementsPage from './announcements.po';

let hooks;
let loginComponent;
let page;
let action;

beforeAll(async () => {
  page = new AnnouncementsPage();
  action = new ActionBarComponent();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('/#/administration/announcements');
});

describe('ROLE_ONC user', () => {
  beforeAll(() => {
    loginComponent.logIn('onc');
  });

  it('should be able to add announcement', () => {
    const timestamp = Date.now();
    const text = `Test - ${timestamp}`;
    const currentdate = new Date();
    const nextDay = new Date(currentdate);
    const endDateValue = `${currentdate.getMonth() + 1}/${
      nextDay.getDate() + 1}/${
      currentdate.getFullYear()} ${
      currentdate.getHours()}:${
      currentdate.getMinutes()}PM`;
    page.addAnnouncementButton.click();
    page.announcementTitle.setValue('Test');
    page.announcementText.setValue(text);
    page.announcementEndDateTime.setValue(endDateValue);
    page.isPublicToggle.click();
    action.save();
    browser.waitUntil(() => page.announcementDisplay.isDisplayed());
    page.announcementDisplay.click();
    expect(page.announcementDisplay.getText()).toContain(text);
  });
});
