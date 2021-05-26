import LoginComponent from '../login/login.po';
import NavigationComponent from './navigation.po';
import Hooks from '../../utilities/hooks';

let component, hooks, login;

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

  describe('as an ACB', () => {
    beforeEach(() => {
      login.logIn('acb');
      login.logoutButton.waitForDisplayed();
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
      let reports = new Set(component.reports.map(item => item.getText()));
      expect(reports.size).toBe(expected.length);
      expected.forEach(exp => {
        expect(reports.has(exp)).toBe(true, 'did not find expected report: "' + exp + '"');
      });
    });
  });

  describe('as ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
      login.logoutButton.waitForDisplayed();
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
      let reports = new Set(component.reports.map(item => item.getText()));
      expect(reports.size).toBe(expected.length);
      expected.forEach(exp => {
        expect(reports.has(exp)).toBe(true, 'did not find expected report: "' + exp + '"');
      });
    });
      it('should have specific options under surveillance', () => {
       const expected = [
          'Manage',
          'Complaints Reporting',
          'Reporting',
        ];
        component.surveillanceToggle.click();
        let surveillanceOptions = new Set(component.surveillanceOptions.map(item => item.getText()));
        expect(surveillanceOptions.size).toBe(expected.length);
        expected.forEach(exp => {
          expect(surveillanceOptions.has(exp)).toBe(true);
        });
      });
  });
  describe('as ONC-STAFF', () => {
    beforeEach(() => {
      login.logIn('oncstaff');
      login.logoutButton.waitForDisplayed();
    });

      it('should have specific options under surveillance', () => {
       const expected = [
          'Complaints Reporting',
          'Reporting',
        ];
        component.surveillanceToggle.click();
        let surveillanceOptions = new Set(component.surveillanceOptions.map(item => item.getText()));
        expect(surveillanceOptions.size).toBe(expected.length);
        expected.forEach(exp => {
          expect(surveillanceOptions.has(exp)).toBe(true);
        });
      });
  });
});
