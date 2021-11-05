import LoginComponent from '../login/login.po';
import Hooks from '../../utilities/hooks';

import NavigationComponent from './navigation.po';

let component;
let hooks;
let login;

beforeEach(async () => {
  component = new NavigationComponent();
  login = new LoginComponent();
  hooks = new Hooks();
  await hooks.open('#/resources/overview');
});

describe('when logged in', () => {
  afterEach(() => {
    login.logOut();
  });

  describe('as ROLE_ACB', () => {
    beforeEach(() => {
      login.logIn('acb');
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
  });
  describe('as ROLE_ONC_STAFF', () => {
    beforeEach(() => {
      login.logIn('oncstaff');
    });

    it('should have specific options under surveillance', () => {
      const expected = [
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
    it('should have specific reports', () => {
      const expected = [
        'Developers',
        'Listings',
        'Products',
        'User Actions',
        'Users',
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
  describe('as ROLE_ADMIN', () => {
    beforeEach(() => {
      login.logIn('admin');
    });

    it('should have specific options under surveillance', () => {
      const expected = [
        'Upload',
        'Confirm',
        'Manage',
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
  });
});
