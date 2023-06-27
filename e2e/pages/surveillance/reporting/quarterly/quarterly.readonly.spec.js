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

xdescribe('the quarterly surveillance reporting page', () => {
  beforeEach(async () => {
    loginComponent = new LoginComponent();
    reportingPage = new ReportingPage();
    toast = new ToastComponent();
    action = new ActionBarComponent();
    quarterlyPage = new QuarterlyPage();
    complaints = new ComplaintsComponent();
    await open('#/resources/overview');
  });

  describe('when logged in as a ROLE_ONC', () => {
    const acb = 'Drummond Group';
    const year = 2020;
    const quarter = 'Q1';

    beforeEach(async () => {
      await loginComponent.logIn('onc');
      await open('#/surveillance/reporting');
      await (await reportingPage.acbHeader).isDisplayed();
      await reportingPage.expandAcb('Drummond Group');
      await (await reportingPage.editQuarterlyReport(acb, year, quarter)).click();
      await quarterlyPage.waitForQuarterToBeFullyLoaded(`${acb} - ${year} - ${quarter}`);
    });

    afterEach(async () => {
      if (await (await toast.toastTitle).isExisting()) {
        await toast.clearAllToast();
      }
      await loginComponent.logOut();
    });

    it('can only view initiated quarterly report', async () => {
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
      await complaints.searchForText('SC-000031');
      await (await complaints.viewButton).click();
      await expect(await (await complaints.editButton).isDisplayed()).toBe(false);
    });
  });
});
