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
    it('should have specific options under shortcuts', () => {
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
      expect(shortcuts.size).toBe(expected.length);
      expected.forEach((exp) => {
        expect(shortcuts.has(exp)).toBe(true, `did not find expected shortcut: "${exp}"`);
      });
      component.shortcutToggle.click();
    });

    it('should have specific options under resources', () => {
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
      expect(resources.size).toBe(expected.length);
      expected.forEach((exp) => {
        expect(resources.has(exp)).toBe(true, `did not find expected resource: "${exp}"`);
      });
      component.resourceToggle.click();
    });
  });

  describe('when logged in', () => {
    afterEach(() => {
      login.logOut();
    });

    describe('as ROLE_ACB', () => {
      beforeEach(() => {
        login.logIn('drummond');
      });

      it('should have specific reports', () => {
        const expected = [
          'Developers',
          'Listings',
          'ONC-ACBs',
          'Products',
          'Versions',
        ];
        component.reportsToggle.click();
        const reports = new Set(component.reports.map((item) => item.getText()));
        expect(reports.size).toBe(expected.length);
        expected.forEach((exp) => {
          expect(reports.has(exp)).toBe(true, `did not find expected report: "${exp}"`);
        });
      });
    });

    describe('as ROLE_ONC', () => {
      beforeEach(() => {
        login.logIn('onc');
        component.showNavigation();
      });

      it('should have specific reports', () => {
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
        expect(reports.size).toBe(expected.length);
        expected.forEach((exp) => {
          expect(reports.has(exp)).toBe(true, `did not find expected report: "${exp}"`);
        });
      });

      it('should have specific options under surveillance', () => {
        const expected = [
          'Activity Reporting',
          'Complaints Reporting',
          'Reporting',
        ];
        component.surveillanceToggle.click();
        const surveillanceOptions = new Set(component.surveillanceOptions.map((item) => item.getText()));
        expect(surveillanceOptions.size).toBe(expected.length);
        expected.forEach((exp) => {
          expect(surveillanceOptions.has(exp)).toBe(true);
        });
      });

      it('should have specific options under shortcuts', () => {
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
        expect(shortcuts.size).toBe(expected.length);
        expected.forEach((exp) => {
          expect(shortcuts.has(exp)).toBe(true, `did not find expected shortcut: "${exp}"`);
        });
        component.shortcutToggle.click();
      });

      it('should have specific options under resources', () => {
        const expected = [
          'Overview',
          'CHPL Public User Guide',
          'CHPL Developer User Guide',
          'CMS ID Reverse Lookup',
          'Download the CHPL',
          'CHPL API',
          'Contact Us',
        ];
        component.resourceToggle.click();
        const resources = new Set(component.resources.map((item) => item.getText()));
        expect(resources.size).toBe(expected.length);
        expected.forEach((exp) => {
          expect(resources.has(exp)).toBe(true, `did not find expected resource: "${exp}"`);
        });
        component.resourceToggle.click();
      });
    });

    describe('as ROLE_ADMIN', () => {
      beforeEach(() => {
        login.logIn('admin');
      });

      it('should have specific options under surveillance', () => {
        const expected = [
          'Manage',
          'Activity Reporting',
          'Complaints Reporting',
          'Reporting',
        ];
        component.surveillanceToggle.click();
        const surveillanceOptions = new Set(component.surveillanceOptions.map((item) => item.getText()));
        expect(surveillanceOptions.size).toBe(expected.length);
        expected.forEach((exp) => {
          expect(surveillanceOptions.has(exp)).toBe(true, `did not find expected surveillance option: "${exp}"`);
        });
      });
    });

    describe('as ROLE_DEVELOPER', () => {
      beforeEach(() => {
        login.logIn('developer');
      });

      it('should have developer options', () => {
        const expected = [
          'Cerner Corporation',
          'Health Metrics System, Inc',
          'Net Health',
        ];
        component.developersToggle.click();
        const developers = new Set(component.developers.map((item) => item.getText()));
        expect(developers.size).toBe(expected.length);
        expected.forEach((exp) => {
          expect(developers.has(exp)).toBe(true, `did not find expected developer: "${exp}"`);
        });
      });
    });
  });
});
