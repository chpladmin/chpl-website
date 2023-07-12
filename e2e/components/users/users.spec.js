import LoginComponent from '../login/login.sync.po';
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

  /* ignored due to being flaky, to be addressed in OCD-3668 */
  xit('should allow editing of the title', () => {
    const element = component.getComponent('AQA ONC');
    const initialTitle = component.getDemographic(element, 'Title:');
    component.editUser(element);
    const title = `M. ${Date.now()}`;
    component.setDemographic(title, 'title');
    actionBar.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => component.getDemographic(element, 'Title:') !== initialTitle);
    expect(component.getDemographic(element, 'Title:')).toBe(title);
  });

  it('should allow editing of the phone number', () => {
    const element = component.getComponent('AQA ONC');
    const initialNumber = component.getDemographic(element, 'Phone Number:');
    component.editUser(element);
    const number = `${Date.now() % 10000000}`;
    component.setDemographic(number, 'phoneNumber');
    actionBar.save();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => component.getDemographic(element, 'Phone Number:') !== initialNumber);
    expect(component.getDemographic(element, 'Phone Number:')).toBe(number);
  });
});
