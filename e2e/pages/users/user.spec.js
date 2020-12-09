import LoginComponent from '../../components/login/login.po';
import UsersPage from './user.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import Hooks from '../../utilities/hooks';

let actionBarComponent, hooks, loginComponent, page;

beforeEach(async () => {
    loginComponent = new LoginComponent();
    actionBarComponent = new ActionBarComponent();
    page = new UsersPage();
    hooks = new Hooks();
    await hooks.open('#/search');
});

describe('ONC STAFF can ', () => {
    beforeEach(function () {
        loginComponent.logInWithEmail('oncstaff');
        page.usersButton.click();
        page.userManagementButton.click();
    });

    afterEach(function () {
        loginComponent.logOut();
    });

    it('change title successfully', () => {
        page.editUser('AQA ONC STAFF');
        let title = 'Mr' + (new Date()).getDate();
        page.userTitle.clearValue();
        page.userTitle.addValue(title);
        actionBarComponent.save();
        assert.include(page.userInformation('AQA ONC STAFF').getText(),title);
    });

    it('change phone number successfully', () => {
        page.editUser('AQA ONC STAFF');
        let number = (new Date()).getTime() % 1000000;
        page.userPhoneNumber.clearValue();
        page.userPhoneNumber.addValue(number);
        actionBarComponent.save();
        assert.include(page.userInformation('AQA ONC STAFF').getText(),number);
    });
});
