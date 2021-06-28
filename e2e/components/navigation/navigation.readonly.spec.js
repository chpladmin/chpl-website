import LoginComponent from '../login/login.po';
import NavigationComponent from './navigation.po';
import Hooks from '../../utilities/hooks';

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

  describe('as an ACB', () => {
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

  describe('as ONC', () => {
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
  });
});
