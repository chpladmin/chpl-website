import LoginPage from './Login.po.js'
import SearchPage from '../../pages/search/SearchPage.po.js'

beforeEach(async () => {
    await SearchPage.open();
});

describe('Login page', () => {

    it('should have username field', () => {
        LoginPage.gotoLoginPage();
        assert.equal(LoginPage.username.isDisplayed(),true);
    })

})
