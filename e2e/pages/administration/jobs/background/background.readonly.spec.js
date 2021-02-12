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

describe('when an ONC-Staff user is logged in', () => {
  beforeEach(function () {
    loginComponent.logInWithEmail('oncstaff');
    hooks.open('#/administration/jobs/background');
    browser.pause(2000); //Have to add this wait as jobs gets in order in micro seconds.
  });

  it('should see the right set of background jobs', () => {
    var actualResult = [];
    var expectedResult = ['Export Annual Report','Export Quarterly Report','MUU Upload','Surveillance Upload'];
    var length = background.backgroundJobRows.length;
    for ( var j = 0; j < length; j++ ) {
      actualResult.push(background.backgroundJobName(j).getText());
    }
    assert.equal(actualResult.toString(),expectedResult.toString());
  });

});
