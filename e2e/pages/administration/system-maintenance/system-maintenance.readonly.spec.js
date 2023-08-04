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
      await page.open();
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

    it('should allow navigation to "accessibility-standards" but disable the navigation afterwards', async () => {
      await expect(await page.canNavigate('accessibility-standards')).toBe(true);
      await page.navigate('accessibility-standards');
      await expect(await page.canNavigate('accessibility-standards')).toBe(false);
    });

    it('should allow navigation to "qms-standards" but disable the navigation afterwards', async () => {
      await expect(await page.canNavigate('qms-standards')).toBe(true);
      await page.navigate('qms-standards');
      await expect(await page.canNavigate('qms-standards')).toBe(false);
    });

    it('should allow navigation to "svaps" but disable the navigation afterwards', async () => {
      await expect(await page.canNavigate('svaps')).toBe(true);
      await page.navigate('svaps');
      await expect(await page.canNavigate('svaps')).toBe(false);
    });

    it('should allow navigation to "ucd-processes" but disable the navigation afterwards', async () => {
      await expect(await page.canNavigate('ucd-processes')).toBe(true);
      await page.navigate('ucd-processes');
      await expect(await page.canNavigate('ucd-processes')).toBe(false);
    });
  });

  describe('when logged in as ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await page.open();
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should allow navigation to "system-jobs" but disable the navigation afterwards', async () => {
      await expect(await page.canNavigate('system-jobs')).toBe(true);
      await page.navigate('system-jobs');
      await expect(await page.canNavigate('system-jobs')).toBe(false);
    });

    it('should allow navigation to "test-tools" but disable the navigation afterwards', async () => {
      await expect(await page.canNavigate('test-tools')).toBe(true);
      await page.navigate('test-tools');
      await expect(await page.canNavigate('test-tools')).toBe(false);
    });
  });
});
