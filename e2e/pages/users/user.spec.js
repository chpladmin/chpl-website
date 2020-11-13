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

    it('change title successfully', () => {
        page.editUser('AQA ONC STAFF');
        page.userTitle.clearValue();
        page.userTitle.addValue('Mr');
        actionBarComponent.save();
        assert.include(page.userInformation('AQA ONC STAFF').getText(),'Mr');
    });

    it('change phone number successfully', () => {
        page.editUser('AQA ONC STAFF');
        page.userPhoneNumber.clearValue();
        page.userPhoneNumber.addValue('000-000-0000');
        actionBarComponent.save();
        assert.include(page.userInformation('AQA ONC STAFF').getText(),'000-000-0000');
    });

    it('change status of locked , enabled, password change on next login successfully', () => {
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
