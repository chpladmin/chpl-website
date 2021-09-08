import LoginComponent from './login.po';
import Hooks from '../../utilities/hooks';

let component;
let hooks;

describe('the login component', () => {
  beforeEach(async () => {
    component = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/resources/overview');
  });

  describe('when logging in', () => {
    afterEach(() => {
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
  });

  it('should be able to log out', () => {
    component.logIn('onc');
    expect(component.getLoggedInUserName()).toBe('AQA ONC');
    component.logOut();
    expect(/Administrator Login/i.test(component.getLoggedInUserName())).toBe(true);
  });
});
