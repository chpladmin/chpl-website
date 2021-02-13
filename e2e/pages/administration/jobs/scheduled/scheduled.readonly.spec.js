import LoginComponent from '../../../../components/login/login.po';
import ScheduledPage from './scheduled.po';
import Hooks from '../../../../utilities/hooks';
import { assert } from 'chai';

let hooks, loginComponent, scheduled;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  scheduled = new ScheduledPage();
  hooks = new Hooks();
  await hooks.open('#/search');
});

describe('when an ONC-Staff user is logged in', () => {
  beforeEach(function () {
    loginComponent.logInWithEmail('oncstaff');
    hooks.open('#/administration/jobs/scheduled');
    browser.pause(2000); //Have to add this wait as jobs gets in order in micro seconds
  });

  it('should see the right set of scheduled jobs', () => {
    var actualResult = new Set([]);
    var expectedResult = new Set(['All Broken Surveillance Rules Report','Developer Access Report','Inherited Certification Status Errors Report','Listing Validation Email Report','Overnight Broken Surveillance Rules Report','Pending "Change Request" Report','Questionable Activity Report','Questionable URL Report','Real World Testing Email Report','Summary Statistics Email','Trigger Developer Ban Notification']);
    var length = scheduled.scheduledJobRows.length;
    for ( var j = 0; j < length; j++ ) {
      actualResult.add(scheduled.scheduledJobName(j).getText());
    }
    var isExist;
    assert.equal(actualResult.size,expectedResult.size);
    for (var value of actualResult) {
      if (!expectedResult.has(value)) {
        return isExist = false;
      }
      return isExist = true;
    }
    assert.isTrue(isExist);
  });

});
