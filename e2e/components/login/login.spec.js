import LoginComponent from './login.po'
import Hooks from '../../utilities/hooks'

let component, hooks;

beforeEach(async () => {
    component = new LoginComponent();
    hooks = new Hooks();
    await hooks.open('/resources/overview');
});

describe('Login page', () => {

    it('should have username field', () => {
        component.openLoginComponent();
        assert.equal(component.usernameInput.isDisplayed(),true);
    })

})
