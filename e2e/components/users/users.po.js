class UsersComponent {
  constructor() {
    this.elements = {
      demographicPanel: 'div:nth-child(2)',
      demographics: 'p',
    };
  }

  getUserDemographics(name) {
    return $(`div[title="${name} Information"]`)
      .$(this.elements.demographicPanel)
      .$$(this.elements.demographics);
  }
}

export default UsersComponent;
