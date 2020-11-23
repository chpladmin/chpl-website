import LoginComponent from './login.po';
import Hooks from '../../utilities/hooks';

let component, hooks;

beforeEach(async () => {
    component = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/resources/overview');
});

describe('when logging in', () => {
    afterEach(() => {
        component.logOut();
    });

    it('should be able to log in as ACB', () => {
        component.logIn('acb');
        component.logoutButton.waitForDisplayed();
        expect(component.toggleLoginComponent.getText()).toBe('AQA ACB');
    });

    it('should be able to log in as ONC', () => {
        component.logIn('onc');
        component.logoutButton.waitForDisplayed();
        expect(component.toggleLoginComponent.getText()).toBe('AQA ONC');
    });

    it('should be able to log in as ADMIN', () => {
        component.logIn('admin');
        component.logoutButton.waitForDisplayed();
        expect(component.toggleLoginComponent.getText()).toBe('AQA Admin');
    });

    it('should be able to log in as ADMIN with an email address', () => {
        component.logInWithEmail('admin');
        component.logoutButton.waitForDisplayed();
        expect(component.toggleLoginComponent.getText()).toBe('AQA Admin');
    });

    it('should be able to log in as ONC with an email address', () => {
        component.logInWithEmail('onc');
        component.logoutButton.waitForDisplayed();
        expect(component.toggleLoginComponent.getText()).toBe('AQA ONC');
    });

    it('should be able to log in as ACB with an email address', () => {
        component.logInWithEmail('acb');
        component.logoutButton.waitForDisplayed();
        expect(component.toggleLoginComponent.getText()).toBe('AQA ACB');
    });

    it('should be able to log in as ONC_STAFF with an email address', () => {
        component.logInWithEmail('oncstaff');
        component.logoutButton.waitForDisplayed();
        expect(component.toggleLoginComponent.getText()).toBe('AQA ONC STAFF');
    });

    xit('should be able to log in as developer with an email address', () => {
    //     component.logInWithEmail('developer');
    //     component.logoutButton.waitForDisplayed();
    //     expect(component.toggleLoginComponent.getText()).toBe('AQA Developers');
    // });
});

describe('when logging out', () => {
    beforeEach(() => {
        component.logIn('acb');
        component.toggleLoginComponent.click();
    });

    it('should be able to log out', () => {
        component.logOut();
        expect(component.loginButton).toBeDisplayed();
    });
});
