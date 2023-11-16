import LoginComponent from '../login/login.sync.po';
import Hooks from '../../utilities/hooks';

import NavigationComponent from './navigation.po';

let component;
let hooks;
let login;

describe('the top navigation', () => {
  beforeEach(async () => {
    component = new NavigationComponent();
    login = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/resources/overview');
  });

  describe('when not logged in', () => {
    it('should have specific options under shortcuts', async () => {
      const expected = [
        'API Info for 2015 Ed. Products',
        'Banned Developers',
        'Charts',
        'Decertified Products',
        'Real World Testing',
        'Inactive Certificates',
        'Products: Corrective Action',
        'SED Info for 2015 Ed. Products',
        'SVAP Information',
      ];
      component.shortcutToggle.click();
      const shortcuts = new Set(component.shortcuts.map((item) => item.getText()));
      await expect(shortcuts.size).toBe(expected.length);
    });

    it('should have specific options under resources', async () => {
      const expected = [
        'Overview',
        'CHPL Public User Guide',
        'CMS ID Reverse Lookup',
        'Download the CHPL',
        'CHPL API',
        'Contact Us',
      ];
      component.resourceToggle.click();
      const resources = new Set(component.resources.map((item) => item.getText()));
      await expect(resources.size).toBe(expected.length);
    });
  });

  //ignoring these tests as they start failing since chrome driver version updated to 118 - will address these tests later
  xdescribe('when logged in', () => {
    afterEach(() => {
      login.logOut();
    });

    describe('as ROLE_ACB', () => {
      beforeEach(async () => {
        login.logIn('drummond');
      });

      it('should have specific reports', async () => {
        const expected = [
          'Developers',
          'Listings',
          'ONC-ACBs',
          'Products',
          'Versions',
        ];
        component.reportsToggle.click();
        const reports = new Set(component.reports.map((item) => item.getText()));
        await expect(reports.size).toBe(expected.length);
      });
    });

    //ignoring these tests as they start failing since chrome driver version updated to 118 - will address these tests later
    xdescribe('as ROLE_ONC', () => {
      beforeEach(async () => {
        login.logIn('onc');
        component.showNavigation();
      });

      it('should have specific reports', async () => {
        const expected = [
          'API Keys',
          'Announcements',
          'Developers',
          'Listings',
          'ONC-ACBs',
          'ONC-ATLs',
          'Products',
          'User Actions',
          'Users',
          'Versions',
          'Questionable Activity',
        ];
        component.reportsToggle.click();
        const reports = new Set(component.reports.map((item) => item.getText()));
        await expect(reports.size).toBe(expected.length);
      });

      it('should have specific options under surveillance', async () => {
        const expected = [
          'Activity Reporting',
          'Complaints Reporting',
          'Reporting',
        ];
        component.surveillanceToggle.click();
        const surveillanceOptions = new Set(component.surveillanceOptions.map((item) => item.getText()));
        await expect(surveillanceOptions.size).toBe(expected.length);
      });
    });

    //ignoring these tests as they start failing since chrome driver version updated to 118 - will address these tests later
    xdescribe('as ROLE_ADMIN', () => {
      beforeEach(async () => {
        login.logIn('admin');
      });

      it('should have specific options under surveillance', async () => {
        const expected = [
          'Manage',
          'Activity Reporting',
          'Complaints Reporting',
          'Reporting',
        ];
        component.surveillanceToggle.click();
        const surveillanceOptions = new Set(component.surveillanceOptions.map((item) => item.getText()));
        await expect(surveillanceOptions.size).toBe(expected.length);
      });
    });

    //ignoring these tests as they start failing since chrome driver version updated to 118 - will address these tests later
    xdescribe('as ROLE_DEVELOPER', () => {
      beforeEach(async () => {
        login.logIn('developer');
      });

      it('should have developer options', async () => {
        const expected = [
          'Cerner Corporation',
          'Health Metrics System, Inc',
          'Net Health',
        ];
        component.developersToggle.click();
        const developers = new Set(component.developers.map((item) => item.getText()));
        await expect(developers.size).toBe(expected.length);
      });
    });
  });
});
