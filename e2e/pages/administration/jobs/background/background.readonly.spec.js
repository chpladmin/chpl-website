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
  });

  it('should see the right set of background jobs', () => {
    const expected = new Set(['Export Annual Report','Export Quarterly Report','MUU Upload','Surveillance Upload']);
    assert.equal(background.backgroundJobRows.length,expected.size);
    background.backgroundJobRows.forEach(row => {
      assert.exists(expected , row.getText());
    });
  });

});
