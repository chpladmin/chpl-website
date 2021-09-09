import ReportingPage from '../reporting.po';
import LoginComponent from '../../../../components/login/login.po';
import Hooks from '../../../../utilities/hooks';
import ToastComponent from '../../../../components/toast/toast.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar.po';
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

describe('ROLE_ONC user', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
    reportingPage.expandAcb('Drummond Group');
    reportingPage.editAnnualReport('Drummond Group', 2019).click();
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('can only view initiated annual report', () => {
    expect(annualPage.obstacleSummary.isDisplayed()).toBe(true);
    expect(annualPage.prioritySummary.isDisplayed()).toBe(true);
    expect(annualPage.obstacleSummary.isEnabled()).toBe(false);
    expect(annualPage.prioritySummary.isEnabled()).toBe(false);
    expect(action.deleteButton.isDisplayed()).toBe(false);
    expect(action.saveButton.isDisplayed()).toBe(false);
  });

  it('can download annual report', () => {
    annualPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });
});

describe('ROLE_ACB user', () => {
  const timestamp = (new Date()).getTime();
  const obstacle = `obstacle summary ${timestamp}`;
  const priority = `priority summary ${timestamp}`;

  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('can initiate annual report', () => {
    reportingPage.initiateAnnualReport('Drummond Group', 2021).click();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    annualPage.obstacleSummary.setValue(obstacle);
    annualPage.prioritySummary.setValue(priority);
    action.save();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.initiateAnnualReport('Drummond Group', 2021).isExisting()).toBe(false);
  });

  it('can edit annual report', () => {
    reportingPage.editAnnualReport('Drummond Group', 2021).click();
    expect(annualPage.obstacleSummary.isDisplayed()).toBe(true);
    annualPage.obstacleSummary.setValue(`${obstacle}-updated`);
    expect(annualPage.prioritySummary.isDisplayed()).toBe(true);
    annualPage.prioritySummary.setValue(`${priority}-updated`);
    action.save();
    hooks.waitForSpinnerToDisappear();
    reportingPage.editAnnualReport('Drummond Group', 2021).click();
    expect(annualPage.prioritySummary.getValue()).toBe(`${priority}-updated`);
    expect(annualPage.obstacleSummary.getValue()).toBe(`${obstacle}-updated`);
  });

  it('can download annual report', () => {
    reportingPage.editAnnualReport('Drummond Group', 2021).click();
    annualPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });

  it('can delete annual report', () => {
    reportingPage.editAnnualReport('Drummond Group', 2021).click();
    action.delete();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.editAnnualReport('Drummond Group', 2021).isExisting()).toBe(false);
  });
});

