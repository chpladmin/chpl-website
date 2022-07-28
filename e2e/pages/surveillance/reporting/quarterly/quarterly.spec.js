import ReportingPage from '../reporting.po';
import LoginComponent from '../../../../components/login/login.sync.po';
import Hooks from '../../../../utilities/hooks';
import ToastComponent from '../../../../components/toast/toast.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar-legacy.po';
import ComplaintsComponent from '../../../../components/surveillance/complaints/complaints.po';

import QuarterlyPage from './quarterly.po';

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
    reportingPage.editQuarterlyReport('Drummond Group', 2020, 'Q1').click();
    hooks.waitForSpinnerToDisappear();
  });

  it('can only view initiated quarterly report', () => {
    browser.waitUntil(() => quarterlyPage.surveillanceActivity.isDisplayed());
    expect(quarterlyPage.surveillanceActivity.isEnabled()).toBe(false);
    expect(quarterlyPage.reactiveSurveillance.isEnabled()).toBe(false);
    expect(quarterlyPage.prioritizedElement.isEnabled()).toBe(false);
    expect(quarterlyPage.disclosureSummary.isEnabled()).toBe(false);
    quarterlyPage.relevantListingsHeader.click();
    expect(quarterlyPage.surveillanceTableRows).toBeGreaterThan(1);
    quarterlyPage.complaintsHeader.click();
    expect(quarterlyPage.complaintsTableRows).toBeGreaterThan(1);
    expect(action.deleteButton.isDisplayed()).toBe(false);
    expect(action.saveButton.isDisplayed()).toBe(false);
  });

  it('can download quarterly report', () => {
    quarterlyPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });

  it('can only view surveillance data of relevant listings under quarterly report', () => {
    quarterlyPage.relevantListingsHeader.click();
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
    expect(quarterlyPage.surveillanceData.isDisplayed()).toBe(false);
  });

  it('can only view complaints', () => {
    quarterlyPage.complaintsHeader.click();
    complaints.viewComplaint('SC-000031');
    expect(complaints.editButton.isDisplayed()).toBe(false);
  });
});

describe('when logged in as a ROLE_ACB', () => {
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

  it('can initiate quarterly report', () => {
    reportingPage.initiateQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => quarterlyPage.surveillanceActivity.isDisplayed());
    expect(quarterlyPage.surveillanceActivity.isDisplayed()).toBe(true);
    expect(quarterlyPage.reactiveSurveillance.isDisplayed()).toBe(true);
    expect(quarterlyPage.prioritizedElement.isDisplayed()).toBe(true);
    expect(quarterlyPage.disclosureSummary.isDisplayed()).toBe(true);
    quarterlyPage.set(fields);
    quarterlyPage.relevantListingsHeader.click();
    expect(quarterlyPage.surveillanceTableRows).toBeGreaterThan(1);
    quarterlyPage.complaintsHeader.click();
    expect(quarterlyPage.complaintsTableRows).toBeGreaterThan(1);
    action.save();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => reportingPage.acbHeader.isDisplayed());
    expect(reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').isExisting()).toBe(true);
  });

  it('can cancel editing of quarterly report and navigates back to reporting screen', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    hooks.waitForSpinnerToDisappear();
    action.cancel();
    action.yes();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => reportingPage.acbHeader.isDisplayed());
    expect(reportingPage.secondaryPageTitle.getText()).toBe('Available reports');
  });

  it('can edit quarterly report', () => {
    const updatedFields = {
      surveillanceActivity: `Surveillance Activity Updated ${timestamp}`,
      reactiveSurveillance: `Reactive Surveillance Updated ${timestamp}`,
      prioritizedElement: `Prioritized Element Updated ${timestamp}`,
      disclosureSummary: `Disclosure Summary Updated ${timestamp}`,
    };
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    browser.waitUntil(() => quarterlyPage.surveillanceActivity.isDisplayed());
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

  it('can edit surveillance data of relevant listings under quarterly report', () => {
    const surData = {
      outcome: '3',
      processType: '1',
      grounds: `grounds ${timestamp}`,
      nonCoformityCause: `nonCoformityCause ${timestamp}`,
      nonConformityNature: `nonConformityNature ${timestamp}`,
      stepsSurveil: `stepsSurveil ${timestamp}`,
      stepsEngage: `stepsEngage ${timestamp}`,
      cost: `cost ${timestamp}`,
      limitationsEvaluation: `limitationsEvaluation ${timestamp}`,
      nondisclosureEvaluation: `nondisclosureEvaluation ${timestamp}`,
      directionDeveloperResolution: `directionDeveloperResolution ${timestamp}`,
      verificationCap: `verificationCap ${timestamp}`,
    };
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    hooks.waitForSpinnerToDisappear();
    quarterlyPage.relevantListingsHeader.click();
    quarterlyPage.viewSurveillanceData(quarterlyPage.getListingId(1, 1));
    quarterlyPage.editSurveillanceData();
    quarterlyPage.setSurvData(surData);
    quarterlyPage.saveSurveillanceData();
    hooks.waitForSpinnerToDisappear();
    quarterlyPage.editSurveillanceData();
    hooks.waitForSpinnerToDisappear();
    expect(quarterlyPage.outcome.getValue()).toBe(surData.outcome);
    expect(quarterlyPage.processType.getValue()).toBe(surData.processType);
    expect(quarterlyPage.grounds.getValue()).toBe(surData.grounds);
    expect(quarterlyPage.nonCoformityCause.getValue()).toBe(surData.nonCoformityCause);
    expect(quarterlyPage.nonConformityNature.getValue()).toBe(surData.nonConformityNature);
    expect(quarterlyPage.stepsSurveil.getValue()).toBe(surData.stepsSurveil);
    expect(quarterlyPage.stepsEngage.getValue()).toBe(surData.stepsEngage);
    expect(quarterlyPage.cost.getValue()).toBe(surData.cost);
    expect(quarterlyPage.limitationsEvaluation.getValue()).toBe(surData.limitationsEvaluation);
    expect(quarterlyPage.nondisclosureEvaluation.getValue()).toBe(surData.nondisclosureEvaluation);
    expect(quarterlyPage.directionDeveloperResolution.getValue()).toBe(surData.directionDeveloperResolution);
    expect(quarterlyPage.verificationCap.getValue()).toBe(surData.verificationCap);
  });

  it('can edit complaints', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    hooks.waitForSpinnerToDisappear();
    quarterlyPage.complaintsHeader.click();
    complaints.viewComplaint('SC - 000135');
    expect(complaints.editButton.isDisplayed()).toBe(true);
  });

  it('can delete quarterly report', () => {
    reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').click();
    action.delete();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4').isExisting()).toBe(false);
  });
});

