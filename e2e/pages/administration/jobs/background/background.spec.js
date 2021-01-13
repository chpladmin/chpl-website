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

describe('ONC-Staff user can see', () => {
    beforeEach(function () {
        loginComponent.logInWithEmail('oncstaff');
        hooks.open('#/administration/jobs/background');
    });

    it('correct background jobs', () => {
        var actualResult = [];
        var expectedResult = ['Export Annual Report','Export Quarterly Report','MUU Upload','Surveillance Upload'];
        var length = background.backgroundJobRowsCount;
        for ( var j = 0; j < length; j++ ) {
            actualResult.push(background.backgroundJobNames(j).getText());
        }
        assert.equal(actualResult.toString(),expectedResult.toString());
    });

});
