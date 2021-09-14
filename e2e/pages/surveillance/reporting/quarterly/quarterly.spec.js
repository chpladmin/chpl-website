import ReportingPage from '../reporting.po';
import LoginComponent from '../../../../components/login/login.po';
import Hooks from '../../../../utilities/hooks';
import ToastComponent from '../../../../components/toast/toast.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar.po';
import QuarterlyPage from './quarterly.po';
import ComplaintsComponent from '../../../../components/surveillance/complaints/complaints.po';

let action; let hooks; let loginComponent; let reportingPage; let quarterlyPage; let toast; let complaints;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  reportingPage = new ReportingPage();
  toast = new ToastComponent();
  action = new ActionBarComponent();
  quarterlyPage = new QuarterlyPage();
  complaints = new ComplaintsComponent();
  await hooks.open('#/surveillance/reporting');
});

describe('ROLE_ONC user', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
    reportingPage.expandAcb('Drummond Group');
    reportingPage.editQuarterlyReport('Drummond Group', 2020, 'Q1').click();
    hooks.waitForSpinnerToDisappear();
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

  it('can view surveillance data of relevant listings under quarterly report', () => {
    quarterlyPage.relevantListingsHeader.scrollAndClick();
    quarterlyPage.viewSurveillanceData(quarterlyPage.getListingId(1, 1));
    quarterlyPage.editSurveillanceData();
    expect(quarterlyPage.outcome.isEnabled()).toBe(false);
    expect(quarterlyPage.processType.isEnabled()).toBe(false);
    expect(quarterlyPage.grounds.isEnabled()).toBe(false);
    expect(quarterlyPage.nonCoformityCause.isEnabled()).toBe(false);
    expect(quarterlyPage.nonConformityNature.isEnabled()).toBe(false);
    expect(quarterlyPage.stepsSurveil.isEnabled()).toBe(false);
    expect(quarterlyPage.stepsEngage.isEnabled()).toBe(false);
    expect(quarterlyPage.cost.isEnabled()).toBe(false);
    expect(quarterlyPage.limitationsEvaluation.isEnabled()).toBe(false);
    expect(quarterlyPage.nondisclosureEvaluation.isEnabled()).toBe(false);
    expect(quarterlyPage.directionDeveloperResolution.isEnabled()).toBe(false);
    expect(quarterlyPage.verificationCap.isEnabled()).toBe(false);
    expect(quarterlyPage.saveSurveillanceData.isDisplayed()).toBe(false);
  });

  it('can only view complaints', () => {
    quarterlyPage.complaintsHeader.scrollAndClick();
    complaints.viewComplaint('SC-000031');
    expect(complaints.editButton.isDisplayed()).toBe(false);
  });
});

describe('ROLE_ACB user', () => {
  const timestamp = (new Date()).getTime();
  const fields = {
    surveillanceActivity: `Surveillance Activity ${timestamp}`,
    reactiveSurveillance: `Reactive Surveillance ${timestamp}`,
    prioritizedElement: `Prioritized Element ${timestamp}`,
    disclosureSummary: `Disclosure Summary ${timestamp}`,
  };

  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('can initiate quarterly report', () => {
    reportingPage.initiateQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(quarterlyPage.surveillanceActivity.isDisplayed()).toBe(true);
    expect(quarterlyPage.reactiveSurveillance.isDisplayed()).toBe(true);
    expect(quarterlyPage.prioritizedElement.isDisplayed()).toBe(true);
    expect(quarterlyPage.disclosureSummary.isDisplayed()).toBe(true);
    quarterlyPage.set(fields);
    quarterlyPage.relevantListingsHeader.scrollAndClick();
    expect(quarterlyPage.surveillanceTableRows).toBeGreaterThan(1);
    quarterlyPage.complaintsHeader.scrollAndClick();
    expect(quarterlyPage.complaintsTableRows).toBeGreaterThan(1);
    action.save();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.initiateQuarterlyReport('Drummond Group', 2022, 'Q4').isExisting()).toBe(false);
  });

  it('can edit quarterly report', () => {
    const updatedFields = {
      surveillanceActivity: `Surveillance Activity Updated ${timestamp}`,
      reactiveSurveillance: `Reactive Surveillance Updated ${timestamp}`,
      prioritizedElement: `Prioritized Element Updated ${timestamp}`,
      disclosureSummary: `Disclosure Summary Updated ${timestamp}`,
    };
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    hooks.waitForSpinnerToDisappear();
    quarterlyPage.set(updatedFields);
    action.save();
    hooks.waitForSpinnerToDisappear();
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    expect(quarterlyPage.surveillanceActivity.getValue()).toBe(updatedFields.surveillanceActivity);
    expect(quarterlyPage.reactiveSurveillance.getValue()).toBe(updatedFields.reactiveSurveillance);
    expect(quarterlyPage.prioritizedElement.getValue()).toBe(updatedFields.prioritizedElement);
    expect(quarterlyPage.disclosureSummary.getValue()).toBe(updatedFields.disclosureSummary);
  });

  it('can download quarterly report', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    quarterlyPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });

  it('can delete quarterly report', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    action.delete();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').isExisting()).toBe(false);
  });

  it('can edit surveillance data of relevant listings under quarterly report', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q1').click();
    hooks.waitForSpinnerToDisappear();
    quarterlyPage.relevantListingsHeader.scrollAndClick();
    quarterlyPage.viewSurveillanceData(quarterlyPage.getListingId(1, 1));
    quarterlyPage.editSurveillanceData();
    // quarterlyPage.verificationCap.setValue(`${surveillanceActivity}-updated`);
    quarterlyPage.saveSurveillanceData();
    hooks.waitForSpinnerToDisappear();
  });

  it('can edit complaints', () => {
    quarterlyPage.complaintsHeader.scrollAndClick();
    complaints.viewComplaint('SC-000031');
    expect(complaints.editButton.isDisplayed()).toBe(true);
  });
});

