import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import UsersComponent from '../../components/users/users.po';

import UsersPage from './users.po';

let hooks;
let login;
let page;
let users;

describe('the User Management Page', () => {
  beforeAll(() => {
    login = new LoginComponent();
    page = new UsersPage();
    users = new UsersComponent();
    hooks = new Hooks();
    hooks.open('#/users');
    login.logIn('admin');
    page.title.waitForDisplayed();
  });

  it('should not have "organizational" users', () => {
    const pageUsers = page.getUsers();
    const organizationalUsers = pageUsers.filter((userComponent) => {
      const role = users.getDemographic(userComponent, 'Role:');
      return ['ROLE_ACB', 'ROLE_ATL', 'ROLE_DEVELOPER'].includes(role);
    });
    expect(organizationalUsers.length).toBe(0);
  });
});
