import ReportingPage from '../reporting.async.po';
import LoginComponent from '../../../../components/login/login.po';
import { open } from '../../../../utilities/hooks.async';
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

describe('the quarterly surveillance reporting page', () => {
  beforeEach(async () => {
    loginComponent = new LoginComponent();
    reportingPage = new ReportingPage();
    toast = new ToastComponent();
    action = new ActionBarComponent();
    quarterlyPage = new QuarterlyPage();
    complaints = new ComplaintsComponent();
    await open('#/resources/overview');
    await loginComponent.logIn('drummond');
    await open('#/surveillance/reporting');
    await (await reportingPage.acbHeader).isDisplayed();
  });

  afterEach(async () => {
    if (await (await toast.toastTitle).isExisting()) {
      await toast.clearAllToast();
    }
    await loginComponent.logOut();
  });

  describe('when working with old reports', () => {
    const acb = 'Drummond Group';
    const year = 2021;
    const quarter = 'Q4';
    const timestamp = Date.now();

    it('can edit quarterly report', async () => {
      const updatedFields = {
        surveillanceActivity: `Surveillance Activity Updated ${timestamp}`,
        reactiveSurveillance: `Reactive Surveillance Updated ${timestamp}`,
        prioritizedElement: `Prioritized Element Updated ${timestamp}`,
        disclosureSummary: `Disclosure Summary Updated ${timestamp}`,
      };
      await (await reportingPage.editQuarterlyReport(acb, year, quarter)).click();
      await quarterlyPage.waitForQuarterToBeFullyLoaded(`${acb} - ${year} - ${quarter}`);
      await quarterlyPage.set(updatedFields);
      await action.save();
      await browser.waitUntil(async () => (await reportingPage.acbHeader).isDisplayed());
      await (await reportingPage.editQuarterlyReport(acb, year, quarter)).click();
      await quarterlyPage.waitForQuarterToBeFullyLoaded(`${acb} - ${year} - ${quarter}`);
      await expect(await (await quarterlyPage.surveillanceActivity).getValue()).toBe(updatedFields.surveillanceActivity);
      await expect(await (await quarterlyPage.reactiveSurveillance).getValue()).toBe(updatedFields.reactiveSurveillance);
      await expect(await (await quarterlyPage.prioritizedElement).getValue()).toBe(updatedFields.prioritizedElement);
      await expect(await (await quarterlyPage.disclosureSummary).getValue()).toBe(updatedFields.disclosureSummary);
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
      await (await reportingPage.editQuarterlyReport(acb, year, quarter)).click();
      await quarterlyPage.waitForQuarterToBeFullyLoaded(`${acb} - ${year} - ${quarter}`);
      await (await quarterlyPage.relevantListingsHeader).click();
      const listingId = await quarterlyPage.getListingId(1, 1);
      await quarterlyPage.viewSurveillanceData(listingId);
      await quarterlyPage.editSurveillanceData();
      await quarterlyPage.setSurvData(surData);
      await quarterlyPage.saveSurveillanceData();
      await browser.waitUntil(async () => (await quarterlyPage.progressBar).isDisplayed());
      await quarterlyPage.editSurveillanceData();
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
      await (await reportingPage.editQuarterlyReport(acb, year, quarter)).click();
      await quarterlyPage.waitForQuarterToBeFullyLoaded(`${acb} - ${year} - ${quarter}`);
      await (await quarterlyPage.complaintsHeader).click();
      await complaints.searchForText('SC - 000135');
      await (await complaints.viewButton).click();
      await expect(await (await complaints.editButton).isDisplayed()).toBe(true);
    });
  });

  describe('when working with future reports', () => {
    const acb = 'Drummond Group';
    const year = 2024;
    const quarter = 'Q4';
    const timestamp = Date.now();

    it('can cancel initiating a quarterly report and navigate back to reporting screen', async () => {
      await (await reportingPage.initiateQuarterlyReport(acb, year, quarter)).click();
      await action.no();
      await browser.waitUntil(async () => (await reportingPage.acbHeader).isDisplayed());
      await expect(await (await reportingPage.secondaryPageTitle).getText()).toBe('Available reports');
    });

    it('can initiate and delete quarterly reports', async () => {
      const fields = {
        surveillanceActivity: `Surveillance Activity Created ${timestamp}`,
        reactiveSurveillance: `Reactive Surveillance Create ${timestamp}`,
        prioritizedElement: `Prioritized Element Created ${timestamp}`,
        disclosureSummary: `Disclosure Summary Created ${timestamp}`,
      };
      await (await (await reportingPage.initiateQuarterlyReport(acb, year, quarter))).click();
      await action.yes();
      await quarterlyPage.waitForQuarterToBeFullyLoaded(`${acb} - ${year} - ${quarter}`);
      await quarterlyPage.set(fields);
      await action.save();
      await (await reportingPage.acbHeader).isDisplayed();
      await browser.waitUntil(async () => (await (await reportingPage.secondaryPageTitle).getText()).includes('Available reports'));
      await expect(await (await reportingPage.editQuarterlyReport(acb, year, quarter)).isExisting()).toBe(true);
      await (await reportingPage.editQuarterlyReport(acb, year, quarter)).click();
      await quarterlyPage.waitForQuarterToBeFullyLoaded(`${acb} - ${year} - ${quarter}`);
      await action.delete();
      await action.yes();
      await browser.waitUntil(async () => (await reportingPage.acbHeader).isDisplayed());
      await expect(await (await reportingPage.editQuarterlyReport(acb, year, quarter)).isExisting()).toBe(false);
    });
  });
});
