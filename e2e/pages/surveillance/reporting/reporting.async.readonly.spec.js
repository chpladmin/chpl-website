import LoginComponent from '../../../components/login/login.po';
import {
  open, waitForSpinnerToDisappear,
} from '../../../utilities/hooks.async';

import ReportingPage from './reporting.async.po';

let loginComponent;
let page;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  page = new ReportingPage();
  await open('#/surveillance/reporting');
});

describe('when ACB user is on surveillance reporting page', () => {
  beforeEach(async () => {
    await loginComponent.logIn('drummond');
  });

  afterEach(async () => {
    await loginComponent.logOut();
  });

  it('should only see their own reporting', async () => {
    await browser.waitUntil(async () => await (page.getAcbReportingCount()) > 0);
    await expect(await (page.getAcbReportingCount())).toBe(1);
  });
});

describe('when ONC user is on surveillance reporting page', () => {
  beforeEach(async () => {
    await loginComponent.logIn('onc');
  });

  afterEach(async () => {
    await loginComponent.logOut();
  });

  it('should see all ACB\'s reporting', async () => {
    await waitForSpinnerToDisappear();
    await expect(await (page.getAcbReportingCount())).toBeGreaterThanOrEqual(3);
  });
});
