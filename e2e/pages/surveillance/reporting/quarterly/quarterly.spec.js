import ReportingPage from '../reporting.po';
import LoginComponent from '../../../../components/login/login.po';
import Hooks from '../../../../utilities/hooks';
import ToastComponent from '../../../../components/toast/toast.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar.po';
import QuarterlyPage from './quarterly.po';

let action; let hooks; let loginComponent; let reportingPage; let quarterlyPage; let toast;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  reportingPage = new ReportingPage();
  toast = new ToastComponent();
  action = new ActionBarComponent();
  quarterlyPage = new QuarterlyPage();
  await hooks.open('#/surveillance/reporting');
});

describe('ROLE_ONC user', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
    reportingPage.expandAcb('Drummond Group');
    reportingPage.editQuarterlyReport('Drummond Group', 2019, 'Q1').click();
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('can only view initiated quarterly report', () => {
    expect(quarterlyPage.surveillanceActivity.isDisplayed()).toBe(true);
    expect(quarterlyPage.surveillanceActivity.isEnabled()).toBe(false);
    expect(quarterlyPage.reactiveSurveillance.isDisplayed()).toBe(true);
    expect(quarterlyPage.reactiveSurveillance.isEnabled()).toBe(false);
    expect(quarterlyPage.prioritizedElement.isDisplayed()).toBe(true);
    expect(quarterlyPage.prioritizedElement.isEnabled()).toBe(false);
    expect(quarterlyPage.disclosureSummary.isDisplayed()).toBe(true);
    expect(quarterlyPage.disclosureSummary.isEnabled()).toBe(false);
    quarterlyPage.relevantListingsHeader.scrollAndClick();
    expect(quarterlyPage.surveillanceTableRows).toBeGreaterThan(1);
    quarterlyPage.complaintsHeader.scrollAndClick();
    expect(quarterlyPage.complaintsTableRows).toBeGreaterThan(1);
    expect(action.deleteButton.isDisplayed()).toBe(false);
    expect(action.saveButton.isDisplayed()).toBe(false);
  });

  it('can download quarterly report', () => {
    quarterlyPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });
});

describe('ROLE_ACB user', () => {
  const timestamp = (new Date()).getTime();
  const surveillanceActivity = `Surveillance Activity ${timestamp}`;
  const reactiveSurveillance = `Reactive Surveillance ${timestamp}`;
  const prioritizedElement = `Prioritized Element ${timestamp}`;
  const disclosureSummary = `Disclosure Summary ${timestamp}`;

  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('can initiate quarterly report', () => {
    reportingPage.initiateQuarterlyReport('Drummond Group', 2022, 'Q1').click();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(quarterlyPage.surveillanceActivity.isDisplayed()).toBe(true);
    quarterlyPage.surveillanceActivity.setValue(surveillanceActivity);
    expect(quarterlyPage.reactiveSurveillance.isDisplayed()).toBe(true);
    quarterlyPage.reactiveSurveillance.setValue(reactiveSurveillance);
    expect(quarterlyPage.prioritizedElement.isDisplayed()).toBe(true);
    quarterlyPage.prioritizedElement.setValue(prioritizedElement);
    expect(quarterlyPage.disclosureSummary.isDisplayed()).toBe(true);
    quarterlyPage.disclosureSummary.setValue(disclosureSummary);
    quarterlyPage.relevantListingsHeader.scrollAndClick();
    expect(quarterlyPage.surveillanceTableRows).toBeGreaterThan(1);
    quarterlyPage.complaintsHeader.scrollAndClick();
    expect(quarterlyPage.complaintsTableRows).toBeGreaterThan(1);
    action.save();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.initiateQuarterlyReport('Drummond Group', 2022, 'Q1').isExisting()).toBe(false);
  });

  it('can edit quarterly report', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q1').click();
    hooks.waitForSpinnerToDisappear();
    quarterlyPage.surveillanceActivity.setValue(`${surveillanceActivity}-updated`);
    quarterlyPage.reactiveSurveillance.setValue(`${reactiveSurveillance}-updated`);
    quarterlyPage.prioritizedElement.setValue(`${prioritizedElement}-updated`);
    quarterlyPage.disclosureSummary.setValue(`${disclosureSummary}-updated`);
    action.save();
    hooks.waitForSpinnerToDisappear();
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q1').click();
    expect(quarterlyPage.surveillanceActivity.getValue()).toBe(`${surveillanceActivity}-updated`);
    expect(quarterlyPage.reactiveSurveillance.getValue()).toBe(`${reactiveSurveillance}-updated`);
    expect(quarterlyPage.prioritizedElement.getValue()).toBe(`${prioritizedElement}-updated`);
    expect(quarterlyPage.disclosureSummary.getValue()).toBe(`${disclosureSummary}-updated`);
  });

  it('can download quarterly report', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q1').click();
    quarterlyPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });
  
  it('can delete quarterly report', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q1').click();
    action.delete();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q1').isExisting()).toBe(false);
  });
});

