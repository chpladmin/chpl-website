import LoginComponent from './login.po'
import Hooks from '../../utilities/hooks'

let component, hooks;

beforeEach(async () => {
    component = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('/resources/overview');
});

describe('ACB can', () => {

    it('login successfully', () => {
        component.loginAsACB();
        component.logoutButton.waitForDisplayed();
        assert.equal(component.logoutButton.isDisplayed(),true);
    })

    it('logsout successfully', () => {
        component.logOut();
        component.loginButton.waitForDisplayed();
        assert.equal(component.loginButton.isDisplayed(),true);
    })

})

describe('Admin can', () => {

    it('login successfully', () => {
        component.openLoginComponent();
        component.loginAsAdmin();
        component.logoutButton.waitForDisplayed();
        assert.equal(component.logoutButton.isDisplayed(),true);
    })

    it('logsout successfully', () => {
        component.logOut();
        component.loginButton.waitForDisplayed();
        assert.equal(component.loginButton.isDisplayed(),true);
    })

})
