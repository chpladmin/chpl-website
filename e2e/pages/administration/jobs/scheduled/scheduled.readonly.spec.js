import LoginComponent from '../../../../components/login/login.po';
import ScheduledPage from './scheduled.po';
import Hooks from '../../../../utilities/hooks';

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
    });

    it('should see the right set of scheduled jobs', () => {
        var actualResult = [];
        var expectedResult = ['All Broken Surveillance Rules Report','Developer Access Report','Inherited Certification Status Errors Report','Overnight Broken Surveillance Rules Report','Pending "Change Request" Report','Questionable Activity Report','Questionable URL Report','Summary Statistics Email','Trigger Developer Ban Notification'];
        var length = scheduled.scheduledJobRows.length;
        for ( var j = 0; j < length; j++ ) {
            actualResult.push(scheduled.scheduledJobName(j).getText());
        }
        assert.equal(actualResult.toString(),expectedResult.toString());
    });

});
