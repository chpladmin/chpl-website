/* eslint-disable class-methods-use-this */
class UsersPage {
  constructor() {
    this.elements = {
      users: '#users-toggle',
      usermanagement: '*=User Management',
      title: '#title',
      phoneNumber: '#phone-number',
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

  get title() {
    return $(this.elements.title);
  }

  get phoneNumber() {
    return $(this.elements.phoneNumber);
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

  editUser(fullName) {
    $(`button[title="Edit ${fullName}"]`).scrollIntoView({ block: 'center', inline: 'center' });
    $(`button[title="Edit ${fullName}"]`).click();
  }

  userInformation(fullName) {
    return $(`div[title="${fullName} Information"]`);
  }

  impersonateUser(fullName) {
    $(`button[title="Impersonate ${fullName}"]`).scrollIntoView({ block: 'center', inline: 'center' });
    $(`button[title="Impersonate ${fullName}"]`).click();
  }
}

export default UsersPage;
