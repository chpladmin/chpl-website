import LoginComponent from '../../../../components/login/login.po';
import ScheduledPage from './scheduled.po';
import Hooks from '../../../../utilities/hooks';

let hooks;
let loginComponent;
let scheduled;

describe('the Scheduled Jobs page', () => {
  beforeEach(async () => {
    loginComponent = new LoginComponent();
    scheduled = new ScheduledPage();
    hooks = new Hooks();
    await hooks.open('#/administration/jobs/scheduled');
  });

  it('should have specific jobs for ONC-Staff users', () => {
    const expected = new Set(['All Broken Surveillance Rules Report', 'Cures Statistics Email', 'Developer Access Report', 'Inherited Certification Status Errors Report', 'Listing Validation Email Report', 'ONC-ACB Questionable URL Report', 'Overnight Broken Surveillance Rules Report', 'Pending "Change Request" Report', 'Questionable Activity Report', 'Questionable URL Report', 'Real World Testing Email Report', 'Summary Statistics Email', 'Trigger Developer Ban Notification']);
    loginComponent.logIn('oncstaff');
    hooks.waitForSpinnerToDisappear();
    expect(scheduled.scheduledJobRows.length).toBe(expected.size);
    // get the existing jobs into a de-duplicated array of jobs
    const rows = [...new Set(scheduled.scheduledJobRows.map((row) => row.getText()))];
    // for each of the expected jobs
    expected.forEach((exp) => {
      // count how many existing jobs start with the expected job's name
      const found = rows.filter((row) => row.startsWith(exp)).length;
      expect(found).toBe(1, `did not find expected job: "${exp}"`);
    });
  });
});
