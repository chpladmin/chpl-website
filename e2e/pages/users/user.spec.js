import LoginComponent from '../../components/login/login.po';
import UsersPage from './user.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import Hooks from '../../utilities/hooks';

let actionBarComponent, hooks, loginComponent, page;

beforeAll(async () => {
    loginComponent = new LoginComponent();
    actionBarComponent = new ActionBarComponent();
    page = new UsersPage();
    hooks = new Hooks();
    await hooks.open('#/search');
});

describe('ONC STAFF can ', () => {
    beforeAll(function () {
        loginComponent.logInWithEmail('oncstaff');
        page.usersButton.click();
        page.userManagementButton.click();
    });

    afterAll(function () {
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

describe('ADMIN can ', () => {
    beforeAll(function () {
        loginComponent.logInWithEmail('admin');
        page.usersButton.click();
        page.userManagementButton.click();
    });

    afterAll(function () {
        if (page.lockedCheckbox.isSelected()) {
            page.lockedCheckbox.scrollAndClick();
        }
        if (!page.enabledCheckbox.isSelected()) {
            page.enabledCheckbox.scrollAndClick();
        }
        if (page.pwChangeCheckbox.isSelected()) {
            page.pwChangeCheckbox.scrollAndClick();
        }
        actionBarComponent.save();
    });

    it('change status of locked , enabled, password change on next login successfully for ROLE_ONC_STAFF', () => {
        page.editUser('AQA ONC STAFF');
        page.lockedCheckbox.scrollAndClick();
        page.enabledCheckbox.scrollAndClick();
        page.pwChangeCheckbox.scrollAndClick();
        var isLocked = page.lockedCheckbox.isSelected();
        var isEnabled = page.enabledCheckbox.isSelected();
        var isPasswordChange = page.pwChangeCheckbox.isSelected();
        actionBarComponent.save();
        page.editUser('AQA ONC STAFF');
        assert.equal(page.lockedCheckbox.isSelected(),isLocked);
        assert.equal(page.enabledCheckbox.isSelected(),isEnabled);
        assert.equal(page.pwChangeCheckbox.isSelected(),isPasswordChange);
    });

});
