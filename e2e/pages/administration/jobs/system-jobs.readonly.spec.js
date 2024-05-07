import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import LoginComponent from '../../../components/login/login.po';
import { open } from '../../../utilities/hooks';
import SystemMaintenancePage from '../../../pages/administration/system-maintenance/system-maintenance.po';

import SystemJobsComponent from './system-jobs.po';

let login;
let page;
let component;
let action;

beforeEach(async () => {
  page = new SystemMaintenancePage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  component = new SystemJobsComponent();
  await open('#/resources/overview');
});

describe('the system jobs', () => {
  describe('when logged in as ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await page.open();
      await page.navigate('system-jobs');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should have System Jobs table headers in a defined order', async () => {
      const expectedsystemjobHeaders = ['Job Name', 'Description', 'Actions'];
      const actualsystemjobHeaders = await component.getSystemJobsTableHeaders ();
      await expect(actualsystemjobHeaders.length).toBe(expectedsystemjobHeaders.length, 'Found incorrect number of columns');
      await actualsystemjobHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedsystemjobHeaders[idx]));
    });
  });
});
