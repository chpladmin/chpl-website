import LoginComponent from './login.po';
import Hooks from '../../utilities/hooks';

let component;
let hooks;

describe('the new login component', () => {
  beforeEach(async () => {
    component = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/login');
  });

  describe('when logging in', () => {
    afterEach(() => {
      component.logOut();
    });

    it('should be able to log in as drummond ACB', () => {
      component.logIn('drummond');
      expect(component.getLoggedInUserName()).toBe('AQA Drummond');
    });

    it('should be able to log in as ONC', () => {
      component.logIn('onc');
      expect(component.getLoggedInUserName()).toBe('AQA ONC');
    });

    it('should be able to log in as ADMIN', () => {
      component.logIn('admin');
      expect(component.getLoggedInUserName()).toBe('AQA Admin');
    });
  });

  it('should be able to log out', () => {
    component.logIn('onc');
    expect(component.getLoggedInUserName()).toBe('AQA ONC');
    component.logOut();
    expect(component.getLoggedInUserName()).toBe('Administrator Login');
  });
});

describe('the legacy login component', () => {
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
      expect(component.getLoggedInUserName()).toBe('AQA Drummond');
    });

    it('should be able to log in as ONC', () => {
      component.logIn('onc');
      expect(component.getLoggedInUserName()).toBe('AQA ONC');
    });

    it('should be able to log in as ADMIN', () => {
      component.logIn('admin');
      expect(component.getLoggedInUserName()).toBe('AQA Admin');
    });
  });

  it('should be able to log out', () => {
    component.logIn('onc');
    expect(component.getLoggedInUserName()).toBe('AQA ONC');
    component.logOut();
    expect(component.getLoggedInUserName()).toBe('Administrator Login');
  });
});
