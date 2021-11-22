class UsersComponent {
  constructor() {
    this.elements = {
      demographicPanel: 'div:nth-child(2)',
      buttonsPanel: 'div:nth-child(3)',
      demographics: 'p',
      title: '#title',
      phoneNumber: '#phone-number',
    };
  }

  getUserDemographics(name) {
    return $(`div[title="${name} Information"]`)
      .$(this.elements.demographicPanel)
      .$$(this.elements.demographics);
  }

  editUser(name) {
    $(`div[title="${name} Information"]`).scrollIntoView({ block: 'center', inline: 'center' });
    $(`div[title="${name} Information"]`)
      .$(this.elements.buttonsPanel)
      .$(`button[title="Edit ${name}"]`)
      .click();
  }

  setTitle(title) {
    $(this.elements.title).click();
    browser.keys(['Control', 'a', 'Delete']);
    $(this.elements.title).setValue(title);
  }

  setPhoneNumber(phoneNumber) {
    $(this.elements.phoneNumber).click();
    browser.keys(['Control', 'a', 'Delete']);
    $(this.elements.phoneNumber).setValue(phoneNumber);
  }

  getDemographic(name, demo) {
    return this.getUserDemographics(name)
      .map((item) => {
        const data = item.getText().split('\n');
        return {
          key: data[0],
          value: data[1],
        };
      })
      .find((item) => item.key === demo)?.value;
  }
}

export default UsersComponent;
