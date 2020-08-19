import LoginComponent from './login.po'
import Hooks from '../../utilities/hooks'

let component, hooks;

beforeEach(async () => {
    component = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('#/administration/overview');
});

describe('an ACB user', () => {

    it('should be able to login successfully', () => {
        component.loginAsACB();
        component.logoutButton.waitForDisplayed();
        assert.isTrue(component.logoutButton.isDisplayed());
    })

    it('should be able to logsout successfully', () => {
        component.openLoginComponent();
        component.logOut();
        component.loginButton.waitForDisplayed();
        assert.isTrue(component.loginButton.isDisplayed());
    })

})

describe('an Admin user', () => {

    it('should be able to login successfully', () => {
        component.loginAsAdmin();
        component.logoutButton.waitForDisplayed();
        assert.isTrue(component.logoutButton.isDisplayed());
    })

    it('should be able to logsout successfully', () => {
        component.openLoginComponent();
        component.logOut();
        component.loginButton.waitForDisplayed();
        assert.isTrue(component.loginButton.isDisplayed());
    })

})
