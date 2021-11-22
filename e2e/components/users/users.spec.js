import LoginComponent from '../login/login.po';
import Hooks from '../../utilities/hooks';
import ActionBarComponent from '../action-bar/action-bar.po';

import UsersComponent from './users.po';

let actionBar;
let hooks;
let login;
let component;

describe('the users cards', () => {
  beforeAll(() => {
    actionBar = new ActionBarComponent();
    login = new LoginComponent();
    component = new UsersComponent();
    hooks = new Hooks();
    hooks.open('#/users');
    login.logIn('admin');
  });

  it('should allow editing of the title', () => {
    const user = 'AQA ONC Staff';
    const initialTitle = component.getDemographic(user, 'Title:');
    component.editUser(user);
    const title = `M. ${Date.now()}`;
    component.setTitle(title);
    actionBar.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => component.getDemographic(user, 'Title:') !== initialTitle);
    expect(component.getDemographic(user, 'Title:')).toBe(title);
  });

  it('should allow editing of the phone number', () => {
    const user = 'AQA ONC Staff';
    const initialNumber = component.getDemographic(user, 'Phone Number:');
    component.editUser(user);
    const number = `${Date.now() % 10000000}`;
    component.setPhoneNumber(number);
    actionBar.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => component.getDemographic(user, 'Phone Number:') !== initialNumber);
    expect(component.getDemographic(user, 'Phone Number:')).toBe(number);
  });
});
