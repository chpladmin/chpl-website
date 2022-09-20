import LoginComponent from '../../../components/login/login.po';
import { open } from '../../../utilities/hooks.async';

import SystemMaintenancePage from './system-maintenance.po';

let login;
let page;

beforeEach(async () => {
  page = new SystemMaintenancePage();
  login = new LoginComponent();
  await open('#/resources/overview');
});

describe('the system maintenance page', () => {
  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open(open);
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should allow navigation to "announcements" but disable the navigation afterwards', async () => {
      await expect(await page.canNavigate('announcements')).toBe(true);
      await page.navigate('announcements');
      await expect(await page.canNavigate('announcements')).toBe(false);
    });
  });
});
