import LoginComponent from '../../components/login/login.po';
import UsersPage from './user.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import Hooks from '../../utilities/hooks';

let actionBarComponent;
let hooks;
let loginComponent;
let page;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  actionBarComponent = new ActionBarComponent();
  page = new UsersPage();
  hooks = new Hooks();
  await hooks.open('#/search');
});

describe('ONC STAFF can ', () => {
  beforeEach(() => {
    loginComponent.logIn('oncstaff');
    page.usersButton.scrollAndClick();
    page.userManagementButton.scrollAndClick();
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  it('change title successfully', () => {
    page.editUser('AQA ONC Staff');
    const title = `Mr${(new Date()).getDate()}`;
    page.title.clearValue();
    page.title.addValue(title);
    actionBarComponent.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => page.userInformation('AQA ONC Staff').getText().includes(title));
    expect(page.userInformation('AQA ONC Staff').getText()).toContain(title);
  });

  it('change phone number successfully', () => {
    page.editUser('AQA ONC Staff');
    const number = (new Date()).getTime() % 1000000;
    page.phoneNumber.clearValue();
    page.phoneNumber.addValue(number);
    actionBarComponent.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => page.userInformation('AQA ONC Staff').getText().includes(number));
    expect(page.userInformation('AQA ONC Staff').getText()).toContain(number);
  });
});
