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
    const initialTitle = component.getTitle(user);
    component.editUser(user);
    const title = `M. ${Date.now()}`;
    component.setTitle(title);
    actionBar.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => component.getTitle(user) !== initialTitle);
    expect(component.getTitle(user)).toBe(title);
  });
});
