/* eslint-disable class-methods-use-this */
class UsersPage {
  constructor() {
    this.elements = {
      users: '#users-toggle',
      usermanagement: '*=User Management',
      usertitle: '#user-title',
      userPhoneNumber: '#user-phone-number',
      lockedCheckbox: '#is-locked',
      enabledCheckbox: '#is-enabled',
      pwChangeCheckbox: '#is-pwchange',
    };
  }

  get usersButton() {
    return $(this.elements.users);
  }

  get userManagementButton() {
    return $(this.elements.usermanagement);
  }

  get userTitle() {
    return $(this.elements.usertitle);
  }

  get userPhoneNumber() {
    return $(this.elements.userPhoneNumber);
  }

  get lockedCheckbox() {
    return $(this.elements.lockedCheckbox);
  }

  get enabledCheckbox() {
    return $(this.elements.enabledCheckbox);
  }

  get pwChangeCheckbox() {
    return $(this.elements.pwChangeCheckbox);
  }

  editUser(name) {
    $(`//span[text() =" Edit ${name}"]/parent::button`).click();
  }

  userInformation(name) {
    return $(`//h2[text()="${name}"]/parent::div/parent::div/following-sibling::div`);
  }

  impersonateUser(fullName) {
    $(`button[title="Impersonate ${fullName}"]`).scrollIntoView({ block: 'center', inline: 'center' });
    $(`button[title="Impersonate ${fullName}"]`).click();
  }
}

export default UsersPage;
