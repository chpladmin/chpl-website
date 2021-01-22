import LoginComponent from '../../../../components/login/login.po';
import BackgroundPage from './background.po';
import Hooks from '../../../../utilities/hooks';

let background, hooks, loginComponent;

beforeEach(async () => {
    loginComponent = new LoginComponent();
    background = new BackgroundPage();
    hooks = new Hooks();
    await hooks.open('#/search');
});

describe('When an ONC-Staff user is logged in', () => {
    beforeEach(function () {
        loginComponent.logInWithEmail('oncstaff');
        hooks.open('#/administration/jobs/background');
    });

    it('should see the right set of background jobs', () => {
        var actualResult = [];
        var expectedResult = ['MUU Upload','Surveillance Upload','Export Quarterly Report','Export Annual Report'];
        var length = background.backgroundJobRowsCount;
        for ( var j = 0; j < length; j++ ) {
            actualResult.push(background.backgroundJobNames(j).getText());
        }
        assert.equal(actualResult.toString(),expectedResult.toString());
    });

});
