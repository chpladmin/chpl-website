import ReportingPage from '../reporting.async.po';
import LoginComponent from '../../../../components/login/login.po';
import {
  open, waitForSpinnerToAppear, waitForSpinnerToDisappear,
} from '../../../../utilities/hooks.async';
import ToastComponent from '../../../../components/toast/toast.async.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar-legacy.async.po';
import ComplaintsComponent from '../../../../components/surveillance/complaints/complaints.po';

import QuarterlyPage from './quarterly.po';

let action;
let loginComponent;
let reportingPage;
let quarterlyPage;
let toast;
let complaints;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  reportingPage = new ReportingPage();
  toast = new ToastComponent();
  action = new ActionBarComponent();
  quarterlyPage = new QuarterlyPage();
  complaints = new ComplaintsComponent();
  await open('#/surveillance/reporting');
});

afterEach(async () => {
  if (await (await toast.toastTitle).isExisting()) {
    await toast.clearAllToast();
  }
  await loginComponent.logOut();
});

describe('when logged in as a ROLE_ONC', () => {
  beforeEach(async () => {
    await loginComponent.logIn('onc');
    await reportingPage.expandAcb('Drummond Group');
    await (await reportingPage.editQuarterlyReport('Drummond Group', 2020, 'Q1')).click();
    await waitForSpinnerToDisappear();
  });

  it('can only view initiated quarterly report', async () => {
    browser.waitUntil(async () => (await quarterlyPage.surveillanceActivity).isDisplayed());
    await expect(await (await quarterlyPage.surveillanceActivity).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.reactiveSurveillance).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.prioritizedElement).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.disclosureSummary).isEnabled()).toBe(false);
    await (await quarterlyPage.relevantListingsHeader).click();
    await expect(await quarterlyPage.getSurveillanceTableRows()).toBeGreaterThan(1);
    await (await quarterlyPage.complaintsHeader).click();
    await expect(await quarterlyPage.getComplaintsTableRows()).toBeGreaterThan(1);
    await expect(await (await action.deleteButton).isDisplayed()).toBe(false);
    await expect(await (await action.saveButton).isDisplayed()).toBe(false);
  });

  it('can download quarterly report', async () => {
    await (await quarterlyPage.download).click();
    await expect(await (await toast.toastTitle).getText()).toBe('Report is being generated');
  });

  it('can only view surveillance data of relevant listings under quarterly report', async () => {
    await quarterlyPage.relevantListingsHeader.click();
    await quarterlyPage.viewSurveillanceData(await (quarterlyPage.getListingId(1, 1)));
    await quarterlyPage.editSurveillanceData();
    await expect(await (await quarterlyPage.outcome).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.processType).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.grounds).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.nonCoformityCause).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.nonConformityNature).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.stepsSurveil).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.stepsEngage).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.cost).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.limitationsEvaluation).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.nondisclosureEvaluation).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.directionDeveloperResolution).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.verificationCap).isEnabled()).toBe(false);
    await expect(await (await quarterlyPage.surveillanceData).isDisplayed()).toBe(false);
  });

  it('can only view complaints', async () => {
    await quarterlyPage.complaintsHeader.click();
    await complaints.viewComplaint('SC-000031');
    await expect(await (await complaints.editButton).isDisplayed()).toBe(false);
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

  beforeEach(async () => {
    await loginComponent.logIn('drummond');
  });

  it('can initiate quarterly report', async () => {
    await (await (await reportingPage.initiateQuarterlyReport('Drummond Group', 2022, 'Q4'))).click();
    browser.call(() => action.yes());
    await waitForSpinnerToDisappear();
    browser.waitUntil(async () => (await quarterlyPage.surveillanceActivity).isDisplayed());
    await expect(await (await quarterlyPage.surveillanceActivity).isDisplayed()).toBe(true);
    await expect(await (await quarterlyPage.reactiveSurveillance).isDisplayed()).toBe(true);
    await expect(await (await quarterlyPage.prioritizedElement).isDisplayed()).toBe(true);
    await expect(await (await quarterlyPage.disclosureSummary).isDisplayed()).toBe(true);
    await quarterlyPage.set(fields);
    await (await quarterlyPage.relevantListingsHeader).click();
    await expect(await quarterlyPage.getSurveillanceTableRows()).toBeGreaterThan(1);
    await (await quarterlyPage.complaintsHeader).click();
    await expect(await quarterlyPage.getComplaintsTableRows()).toBeGreaterThan(1);
    await action.save();
    await waitForSpinnerToAppear();
    await waitForSpinnerToDisappear();
    await (await reportingPage.acbHeader).isDisplayed();
    await expect(await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).isExisting()).toBe(true);
  });

  it('can cancel editing of quarterly report and navigates back to reporting screen', async () => {
    await (await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4'))).click();
    await waitForSpinnerToDisappear();
    await action.cancel();
    await action.yes();
    await waitForSpinnerToAppear();
    await waitForSpinnerToDisappear();
    browser.waitUntil(async () => (await reportingPage.acbHeader).isDisplayed());
    await expect(await (await reportingPage.secondaryPageTitle).getText()).toBe('Available reports');
  });

  it('can edit quarterly report', async () => {
    const updatedFields = {
      surveillanceActivity: `Surveillance Activity Updated ${timestamp}`,
      reactiveSurveillance: `Reactive Surveillance Updated ${timestamp}`,
      prioritizedElement: `Prioritized Element Updated ${timestamp}`,
      disclosureSummary: `Disclosure Summary Updated ${timestamp}`,
    };
    await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).click();
    browser.waitUntil(async () => (await quarterlyPage.surveillanceActivity).isDisplayed());
    await quarterlyPage.set(updatedFields);
    await action.save();
    await waitForSpinnerToDisappear();
    await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).click();
    await expect(await (await quarterlyPage.surveillanceActivity.getValue())).toBe(updatedFields.surveillanceActivity);
    await expect(await (await quarterlyPage.reactiveSurveillance.getValue())).toBe(updatedFields.reactiveSurveillance);
    await expect(await (await quarterlyPage.prioritizedElement.getValue())).toBe(updatedFields.prioritizedElement);
    await expect(await (await quarterlyPage.disclosureSummary.getValue())).toBe(updatedFields.disclosureSummary);
  });

  it('can download quarterly report', async () => {
    await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).click();
    await (await quarterlyPage.download).click();
    await expect(await (await toast.toastTitle).getText()).toBe('Report is being generated');
  });

  it('can edit surveillance data of relevant listings under quarterly report', async () => {
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
    await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).click();
    await waitForSpinnerToDisappear();
    await await (quarterlyPage.relevantListingsHeader).click();
    await quarterlyPage.viewSurveillanceData(quarterlyPage.getListingId(1, 1));
    await quarterlyPage.editSurveillanceData();
    await quarterlyPage.setSurvData(surData);
    await quarterlyPage.saveSurveillanceData();
    await waitForSpinnerToDisappear();
    await quarterlyPage.editSurveillanceData();
    await waitForSpinnerToDisappear();
    await expect(await (await quarterlyPage.outcome).getValue()).toBe(surData.outcome);
    await expect(await (await quarterlyPage.processType).getValue()).toBe(surData.processType);
    await expect(await (await quarterlyPage.grounds).getValue()).toBe(surData.grounds);
    await expect(await (await quarterlyPage.nonCoformityCause).getValue()).toBe(surData.nonCoformityCause);
    await expect(await (await quarterlyPage.nonConformityNature).getValue()).toBe(surData.nonConformityNature);
    await expect(await (await quarterlyPage.stepsSurveil).getValue()).toBe(surData.stepsSurveil);
    await expect(await (await quarterlyPage.stepsEngage).getValue()).toBe(surData.stepsEngage);
    await expect(await (await quarterlyPage.cost).getValue()).toBe(surData.cost);
    await expect(await (await quarterlyPage.limitationsEvaluation).getValue()).toBe(surData.limitationsEvaluation);
    await expect(await (await quarterlyPage.nondisclosureEvaluation).getValue()).toBe(surData.nondisclosureEvaluation);
    await expect(await (await quarterlyPage.directionDeveloperResolution).getValue()).toBe(surData.directionDeveloperResolution);
    await expect(await (await quarterlyPage.verificationCap).getValue()).toBe(surData.verificationCap);
  });

  it('can edit complaints', async () => {
    await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).click();
    await waitForSpinnerToDisappear();
    await (await quarterlyPage.complaintsHeader).click();
    await complaints.viewComplaint('SC - 000135');
    await expect(await (await complaints.editButton).isDisplayed()).toBe(true);
  });

  it('can delete quarterly report', async () => {
    await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).click();
    await action.delete();
    await action.yes();
    await waitForSpinnerToDisappear();
    await expect(await (await reportingPage.editQuarterlyReport('Drummond Group', 2022, 'Q4')).isExisting()).toBe(false);
  });
});
