const userElements = {
    users: '#users-toggle',
    usermanagement: '*=User Management',
    usertitle: '#user-title',
    userPhoneNumber: '#user-phone-number',
    lockedCheckbox: '#is-locked',
    enabledCheckbox: '#is-enabled',
    pwChangeCheckbox: '#is-pwchange',
};

class UsersPage {
    constructor () { }

    get usersButton () {
        return $(userElements.users);
    }

    get userManagementButton () {
        return $(userElements.usermanagement);
    }

    get userTitle () {
        return $(userElements.usertitle);
    }

    get userPhoneNumber () {
        return $(userElements.userPhoneNumber);
    }

    get lockedCheckbox () {
        return $(userElements.lockedCheckbox);
    }

    get enabledCheckbox () {
        return $(userElements.enabledCheckbox);
    }
    
    get pwChangeCheckbox () {
        return $(userElements.pwChangeCheckbox);
    }

    editUser (name) {
        $('//span[text() =" Edit ' + name + '"]/parent::button').click();
    }

    userInformation (name) {
        return $('//h2[text()="' + name + '"]/parent::div/parent::div/following-sibling::div');
    }

}

export default UsersPage;
