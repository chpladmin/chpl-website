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
    afterEach(() => {
      toast.clearAllToast();
      component.logOut();
    });

    it('should be able to log in as drummond ACB', () => {
      component.logIn('drummond');
      expect(/AQA Drummond/i.test(component.getLoggedInUserName())).toBe(true);
    });

    it('should be able to log in as ONC', () => {
      component.logIn('onc');
      expect(/AQA ONC/i.test(component.getLoggedInUserName())).toBe(true);
    });

    it('should be able to log in as ADMIN', () => {
      component.logIn('admin');
      expect(/AQA Admin/i.test(component.getLoggedInUserName())).toBe(true);
    });

    it('should display a notification when logging in with username', () => {
      component.logIn('admin_no_email');
      browser.waitUntil(() => toast.toastContainer.isDisplayed());
      expect(toast.toastMessage.getText().startsWith('Please use your email address')).toBe(true);
      toast.clearAllToast();
      expect(/AQA Admin/i.test(component.getLoggedInUserName())).toBe(true);
    });
  });

  it('should be able to log out', () => {
    component.logIn('onc');
    expect(component.getLoggedInUserName()).toBe('AQA ONC');
    component.logOut();
    expect(/Administrator Login/i.test(component.getLoggedInUserName())).toBe(true);
  });
});
