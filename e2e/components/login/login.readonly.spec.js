import Hooks from '../../utilities/hooks';
import ToastComponent from '../toast/toast.po';

import LoginComponent from './login.po';

let component;
let hooks;
let toast;

describe('the login component', () => {
  beforeEach(async () => {
    component = new LoginComponent();
    hooks = new Hooks();
    toast = new ToastComponent();
    await hooks.open('#/resources/overview');
  });

  describe('when logging in', () => {
    afterEach(async () => {
      await toast.clearAllToast();
      await component.logOut();
    });

    it('should be able to log in as drummond ACB', async () => {
      await component.logIn('drummond');
      await expect(/AQA Drummond/i.test(await component.getLoggedInUserName())).toBe(true);
    });

    it('should be able to log in as ONC', async () => {
      await component.logIn('onc');
      await expect(/AQA ONC/i.test(await component.getLoggedInUserName())).toBe(true);
    });

    it('should be able to log in as ADMIN', async () => {
      await component.logIn('admin');
      await expect(/AQA Admin/i.test(await component.getLoggedInUserName())).toBe(true);
    });
  });

  it('should be able to log out', async () => {
    await component.logIn('onc');
    await expect(await component.getLoggedInUserName()).toBe('AQA ONC');
    await component.logOut();
    await expect(/Administrator Login/i.test(await component.getLoggedInUserName())).toBe(true);
  });
});
