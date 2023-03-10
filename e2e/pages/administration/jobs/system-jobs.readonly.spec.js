import ActionBarComponent from '../../../components/action-bar/action-bar.async.po';
import LoginComponent from '../../../components/login/login.po';
import { open } from '../../../utilities/hooks.async';
import SystemMaintenancePage from '../../../pages/administration/system-maintenance/system-maintenance.po';

import SystemJobsComponent from './system-jobs.po';

let login;
let page;
let component;
let action;

beforeEach(async () => {
  page = new SystemMaintenancePage();
  action = new ActionBarComponent();
  login = new LoginComponent();
  component = new SystemJobsComponent();
  await open('#/resources/overview');
});

describe('the system jobs', () => {
  describe('when logged in as ADMIN', () => {
    beforeEach(async () => {
      await login.logIn('admin');
      await page.open();
      await page.navigate('system-jobs');
    });

    afterEach(async () => {
      await login.logOut();
    });

    it('should have a title', async () => {
      await expect(await page.getTitle()).toBe('System Maintenance');
    });

    it('should have System Jobs table headers in a defined order', async () => {
      const expectedsystemjobHeaders = ['Job Name', 'Description', 'Actions'];
      const actualsystemjobHeaders = await component.getSystemJobsTableHeaders ();
      await expect(actualsystemjobHeaders.length).toBe(expectedsystemjobHeaders.length, 'Found incorrect number of columns');
      await actualsystemjobHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedsystemjobHeaders[idx]));
    });

    it('should have Currently Scheduled System Jobs table headers in a defined order', async () => {
      const expectedscheduledjobHeaders = ['Job Name', 'Description', 'Next Run Date' , 'Trigger Schedule Type' , 'Actions'];
      const actualscheduledjobHeaders = await component.getScheduledSystemJobsTableHeaders ();
      await expect(actualscheduledjobHeaders.length).toBe(expectedscheduledjobHeaders.length, 'Found incorrect number of columns');
      await actualscheduledjobHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedscheduledjobHeaders[idx]));
    });

    it('should have specific jobs', () => {
      const expected = [
        'AuditDataRetention',
        'apiKeyDeleteJob',
        'apiKeyDeleteWarningEmailJob',
        'brokenSurveillanceRulesCreator',
        'chartDataCreator',
        'curesStatisticsCreator',
        'deprecatedApiUsageEmailJob',
        'directReviewCacheRefresh',
        'directReviewDownloadFileGeneration',
        'downloadFileJob2011',
        'downloadFileJob2014',
        'downloadFileJob2015',
        'g3Sed2015DownloadFileJob',
        'icsErrorsReportCreator',
        'listingValidationReportCreator',
        'massRequirePasswordChangeJob',
        'missingAttestationChangeRequestEmailJob',
        'removeCriteriaJob',
        'summaryStatisticsCreator',
        'surveillanceDownloadFileJob',
        'svapActivityDownloadFileGeneration',
        'updateListingStatusJob',
        'updateParticipantsJob',
        'urlStatusDataCollector',
      ];
      let jobs = component.getAvailableJobs();
      let errors = [];

      expected.forEach((exp) => {
        if (jobs.includes(exp)) {
          jobs = jobs.filter((job) => job !== exp);
        } else {
          errors.push(`Did not find job: ${exp}`);
        }
      });
      if (jobs.length > 0) {
        errors = errors.concat(jobs.map((job) => `Found unexpected job: ${job}`));
      }
      expect(errors.length).toBe(0, errors.join(';'));
    });

  });
});
