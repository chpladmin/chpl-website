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

  getComponent(name) {
    return $(`div[title="${name} Information"]`);
  }

  getUserDemographics(name) {
    return this.getComponent(name)
      .$(this.elements.demographicPanel)
      .$$(this.elements.demographics);
  }

  getDemographic(element, demo) {
    return element
      .$(this.elements.demographicPanel)
      .$$(this.elements.demographics)
      .map((item) => {
        const data = item.getText().split('\n');
        return {
          key: data[0],
          value: data[1],
        };
      })
      .find((item) => item.key === demo)?.value;
  }

  editUser(element) {
    element
      .scrollIntoView({ block: 'center', inline: 'center' });
    element
      .$(this.elements.buttonsPanel)
      .$$('button')[0]
      .click();
  }

  setDemographic(value, demo) {
    $(this.elements[demo]).click();
    browser.keys(['Control', 'a', 'Delete']);
    $(this.elements[demo]).setValue(value);
  }

  impersonateUser(name) {
    $(`//*[contains(@title, 'Impersonate ${name}')]`).click();
  }
}

export default UsersComponent;
