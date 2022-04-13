import LoginComponent from '../../../../components/login/login.po';
import Hooks from '../../../../utilities/hooks';

import ScheduledPage from './scheduled.po';

let hooks;
let login;
let page;

describe('the Scheduled Jobs page', () => {
  beforeEach(async () => {
    login = new LoginComponent();
    page = new ScheduledPage();
    hooks = new Hooks();
    await hooks.open('#/administration/jobs');
  });

  describe('for ROLE_ONC_STAFF', () => {
    beforeEach(() => {
      login.logIn('oncstaff');
      hooks.waitForSpinnerToDisappear();
    });

    afterEach(() => {
      login.logOut();
    });

    it('should have specific jobs', () => {
      const expected = new Set([
        'All Broken Surveillance Rules Report',
        'Cures Statistics Email',
        'Developer Access Report',
        'Developer Attestations Report Email',
        'Inherited Certification Status Errors Report',
        'Listing Validation Email Report',
        'ONC-ACB Questionable URL Report',
        'Overnight Broken Surveillance Rules Report',
        'Pending "Change Request" Report',
        'Questionable Activity Report',
        'Questionable URL Report',
        'Real World Testing Email Report',
        'Summary Statistics Email',
        'Trigger Developer Ban Notification',
      ]);
      const jobs = page.getAvailableJobs();
      expect(jobs.length).toBe(expected.size);

      expected.forEach((exp) => {
        expect(jobs.includes(exp)).toBe(true, `did not find expected job: "${exp}"`);
      });
    });

    it('should show Retired ONC-ACBs are retired on the scheduling page', () => {
      page.startSchedulingAJob('All Broken Surveillance Rules Report');
      const acbs = page.getAvailableAcbs();
      expect(acbs.find((acb) => acb.startsWith('UL LLC')).toLowerCase()).toBe('UL LLC (Retired)'.toLowerCase());
    });
  });
});
