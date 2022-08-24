import LoginComponent from '../../../components/login/login.sync.po';
import Hooks from '../../../utilities/hooks';

import ReportingPage from './reporting.po';

let hooks; let loginComponent; let page;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  page = new ReportingPage();
  await hooks.open('#/surveillance/reporting');
});

describe('when ACB user is on surveillance reporting page', () => {
  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('should only see their own reporting', () => {
    browser.waitUntil(() => page.acbReportingCount > 0);
    expect(page.acbReportingCount).toBe(1);
  });
});

describe('when ONC user is on surveillance reporting page', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('should see all ACB\'s reporting', () => {
    hooks.waitForSpinnerToDisappear();
    expect(page.acbReportingCount).toBeGreaterThanOrEqual(3);
  });
});
