import LoginComponent from './loginComponent.js'
import SearchPage from '../../pages/search/SearchPage.po.js'

beforeEach(async () => {
    await SearchPage.open();
});

describe('Login page', () => {

    it('should have username field', () => {
        LoginComponent.gotoLoginComponent();
        assert.equal(LoginComponent.usernameInput.isDisplayed(),true);
    })

})
