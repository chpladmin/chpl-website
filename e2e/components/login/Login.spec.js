import LoginComponent from './login.po'
import Hooks from '../../utilities/hooks'

beforeEach(async () => {
    await Hooks.open('/resources/overview');
});

describe('Login page', () => {

    it('should have username field', () => {
        LoginComponent.openLoginComponent();
        assert.equal(LoginComponent.usernameInput.isDisplayed(),true);
    })

})
