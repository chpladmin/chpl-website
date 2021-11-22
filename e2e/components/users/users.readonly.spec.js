import LoginComponent from '../login/login.po';
import Hooks from '../../utilities/hooks';

import UsersComponent from './users.po';

let hooks;
let login;
let component;

describe('the users cards', () => {
  beforeAll(() => {
    login = new LoginComponent();
    component = new UsersComponent();
    hooks = new Hooks();
    hooks.open('#/users');
    login.logIn('admin');
  });

  it('should have data elements', () => {
    const data = component.getUserDemographics('AQA ONC Staff');
    expect(data[0].getText()).toBe('Email:\nchpl-onc-staff@ainq.com');
    expect(data[1].getText()).toBe('Phone Number:\n301-560-6999');
    expect(data[2].getText()).toBe('Role:\nROLE_ONC_STAFF');
  });
});
