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

describe('ONC-Staff user can see', () => {
    beforeEach(function () {
        loginComponent.logInWithEmail('oncstaff');
        hooks.open('#/administration/jobs/scheduled');
    });

    it('correct scheduled jobs', () => {
        var actualResult = [];
        var expectedResult = ['All Broken Surveillance Rules Report','Developer Access Report','Inherited Certification Status Errors Report','Overnight Broken Surveillance Rules Report','Pending "Change Request" Report','Real World Testing Email Report'];
        var length = scheduled.scheduledJobRowsCount;
        for ( var j = 0; j < length; j++ ) {
            actualResult.push(scheduled.scheduledJobNames(j).getText());
        }
        assert.equal(actualResult.toString(),expectedResult.toString());
    });

});
