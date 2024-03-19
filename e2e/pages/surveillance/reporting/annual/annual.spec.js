import ReportingPage from '../reporting.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';
import ToastComponent from '../../../../components/toast/toast.async.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar.async.po';

import AnnualPage from './annual.po';

let action; 
let annualPage; 
let loginComponent; 
let reportingPage; 
let toast;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  reportingPage = new ReportingPage();
  toast = new ToastComponent();
  action = new ActionBarComponent();
  annualPage = new AnnualPage();
  await open('#/surveillance/reporting');
});

afterEach(async () => {
  if (await toast.toastTitle.isExisting()) {
    await toast.clearAllToast();
  }
  await loginComponent.logOut();
});

describe('when logged in as a ROLE_ONC', () => {
  beforeEach(async () => {
    await loginComponent.logIn('onc');
    await reportingPage.expandAcb('Drummond Group');
    await (await reportingPage.editAnnualReport('Drummond Group', 2019)).click();
  });

  it('can only view initiated annual report', async () => {
    await (browser.waitUntil(async () => await (await annualPage.obstacleSummaryfield()).isDisplayed()));
    await expect(await annualPage.obstacleSummary.isEnabled()).toBe(false);
    await expect(await annualPage.prioritySummary.isEnabled()).toBe(false);
    await expect(await action.deleteButton.isDisplayed()).toBe(false);
    await expect(await action.saveButton.isDisplayed()).toBe(false);
  });

  it('can download annual report', async () => {
    await annualPage.download.click();
    await browser.waitUntil(async () => await toast.toastTitle.isDisplayed());
    await expect(await toast.toastTitle.getText()).toBe('Report is being generated');
  });
});

xdescribe('when logged in as a ROLE_ACB', () => {
  const timestamp = (new Date()).getTime();
  const fields = {
    obstacle: `Obstacle summary ${timestamp}`,
    priority: `Priority summary ${timestamp}`,
  };

  beforeEach(async () => {
    await loginComponent.logIn('drummond');
  });

  it('can delete annual report', async () => {
    await (await reportingPage.editAnnualReport('Drummond Group', 2020)).click();
    await action.delete();
    await action.yes();
    await expect(await (await reportingPage.editAnnualReport('Drummond Group', 2020)).isExisting()).toBe(false);
  });

  it('can initiate annual report', async () => {
    await (await reportingPage.initiateAnnualReport('Drummond Group', 2020)).click();
    await action.yes();
    await browser.waitUntil(async () => await annualPage.obstacleSummary.isDisplayed());
    await annualPage.set(fields);
    await action.save();
    await browser.waitUntil(async () => await reportingPage.acbHeader.isDisplayed());
    await expect(await (await reportingPage.editAnnualReport('Drummond Group', 2020)).isDisplayed()).toBe(true);
  });

  it('can cancel editing of annual report and navigates back to reporting screen', async () => {
    await (await reportingPage.editAnnualReport('Drummond Group', 2020)).click();
    await action.cancel();
    await action.yes();
    await browser.waitUntil(async () => await reportingPage.acbHeader.isDisplayed());
    await expect(await reportingPage.secondaryPageTitle.getText()).toBe('Available reports');
  });

  it('can edit annual report', async () => {
    const updatedFields = {
      obstacle: `Obstacle summary Updated ${timestamp}`,
      priority: `Priority summary Updated ${timestamp}`,
    };
    await (await reportingPage.editAnnualReport('Drummond Group', 2020)).click();
    await browser.waitUntil(async () => await annualPage.obstacleSummary.isDisplayed());
    await annualPage.set(updatedFields);
    await action.save();
    await (await reportingPage.editAnnualReport('Drummond Group', 2020)).click();
    await expect(await annualPage.prioritySummary.getValue()).toBe(updatedFields.priority);
    await expect(await annualPage.obstacleSummary.getValue()).toBe(updatedFields.obstacle);
  });

  it('can download annual report', async () => {
    await (await reportingPage.editAnnualReport('Drummond Group', 2020)).click();
    await annualPage.download.click();
    await expect(await toast.toastTitle.getText()).toBe('Report is being generated');
  });
});
