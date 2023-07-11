import ReportingPage from '../reporting.po';
import LoginComponent from '../../../../components/login/login.sync.po';
import Hooks from '../../../../utilities/hooks';
import ToastComponent from '../../../../components/toast/toast.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar-legacy.po';

import AnnualPage from './annual.po';

let action; let annualPage; let hooks; let loginComponent; let reportingPage; let toast;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  reportingPage = new ReportingPage();
  toast = new ToastComponent();
  action = new ActionBarComponent();
  annualPage = new AnnualPage();
  await hooks.open('#/surveillance/reporting');
});

afterEach(() => {
  if (toast.toastTitle.isExisting()) {
    toast.clearAllToast();
  }
  loginComponent.logOut();
});

describe('when logged in as a ROLE_ONC', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
    reportingPage.expandAcb('Drummond Group');
    reportingPage.editAnnualReport('Drummond Group', 2019).click();
  });

  it('can only view initiated annual report', () => {
    browser.waitUntil(() => annualPage.obstacleSummary.isDisplayed());
    expect(annualPage.obstacleSummary.isEnabled()).toBe(false);
    expect(annualPage.prioritySummary.isEnabled()).toBe(false);
    expect(action.deleteButton.isDisplayed()).toBe(false);
    expect(action.saveButton.isDisplayed()).toBe(false);
  });

  it('can download annual report', () => {
    annualPage.download.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });
});

describe('when logged in as a ROLE_ACB', () => {
  const timestamp = (new Date()).getTime();
  const fields = {
    obstacle: `Obstacle summary ${timestamp}`,
    priority: `Priority summary ${timestamp}`,
  };

  beforeEach(() => {
    loginComponent.logIn('drummond');
    hooks.waitForSpinnerToDisappear();
  });

  it('can delete annual report', () => {
    reportingPage.editAnnualReport('Drummond Group', 2020).click();
    action.delete();
    action.yes();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.editAnnualReport('Drummond Group', 2020).isExisting()).toBe(false);
  });

  it('can initiate annual report', () => {
    reportingPage.initiateAnnualReport('Drummond Group', 2020).click();
    action.yes();
    browser.waitUntil(() => annualPage.obstacleSummary.isDisplayed());
    annualPage.set(fields);
    action.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => reportingPage.acbHeader.isDisplayed());
    expect(reportingPage.editAnnualReport('Drummond Group', 2020).isDisplayed()).toBe(true);
  });

  it('can cancel editing of annual report and navigates back to reporting screen', () => {
    reportingPage.editAnnualReport('Drummond Group', 2020).click();
    hooks.waitForSpinnerToDisappear();
    action.cancel();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => reportingPage.acbHeader.isDisplayed());
    expect(reportingPage.secondaryPageTitle.getText()).toBe('Available reports');
  });

  it('can edit annual report', () => {
    const updatedFields = {
      obstacle: `Obstacle summary Updated ${timestamp}`,
      priority: `Priority summary Updated ${timestamp}`,
    };
    reportingPage.editAnnualReport('Drummond Group', 2020).click();
    browser.waitUntil(() => annualPage.obstacleSummary.isDisplayed());
    annualPage.set(updatedFields);
    action.save();
    hooks.waitForSpinnerToDisappear();
    reportingPage.editAnnualReport('Drummond Group', 2020).click();
    expect(annualPage.prioritySummary.getValue()).toBe(updatedFields.priority);
    expect(annualPage.obstacleSummary.getValue()).toBe(updatedFields.obstacle);
  });

  it('can download annual report', () => {
    reportingPage.editAnnualReport('Drummond Group', 2020).click();
    annualPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });
});

