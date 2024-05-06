import LoginComponent from '../../../components/login/login.po';
import { open } from '../../../utilities/hooks';

import ReportingPage from './reporting.po';

let login;
let page;

beforeEach(async () => {
  login = new LoginComponent();
  page = new ReportingPage();
  await open('#/resources/overview');
});

describe('when ACB user is on surveillance reporting page', () => {
  beforeEach(async () => {
    await login.logIn('drummond');
    await open('#/surveillance/reporting');
    await (await page.acbHeader).isDisplayed();
  });

  afterEach(async () => {
    await login.logOut();
  });

  it('should only see their own reporting', async () => {
    await browser.waitUntil(async () => (await page.getAcbReportingCount()) > 0);
    await expect(await page.getAcbReportingCount()).toBe(1);
  });
});

//ignoring quarantined test -will be addressed later
xdescribe('when ONC user is on surveillance reporting page', () => {
  beforeEach(async () => {
    await login.logIn('onc');
    await open('#/surveillance/reporting');
    await (await page.acbHeader).isDisplayed();
  });

  afterEach(async () => {
    await login.logOut();
  });

  it('should see all ACB\'s reporting', async () => {
    await expect(await page.getAcbReportingCount()).toBeGreaterThanOrEqual(3);
  });
});
