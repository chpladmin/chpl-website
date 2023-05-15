class ApiPage {
  constructor() {
    this.elements = {
      header: 'h1=CHPL API',
      announcementsController: '#operations-tag-announcements',
      attestationController: '#operations-tag-attestation',
      getAttestationEndpoint: '#operations-attestation-getAllPeriods',
      nameOrganization: '#name-organization',
      email: '#email',
      registerButton: '#register-button',
    };
  }

  async getTitle() {
    return (await $(this.elements.header)).getText();
  }

  async getBodyText() {
    return (await (await (await $(this.elements.header)).parentElement()).nextElement()).getText();
  }

  get announcementsController() {
    return $(this.elements.announcementsController);
  }

  get attestationController() {
    return $(this.elements.attestationController);
  }

  get getAttestationEndpoint() {
    return $(this.elements.getAttestationEndpoint);
  }

  get nameOrganization() {
    return $(this.elements.nameOrganization);
  }

  get email() {
    return $(this.elements.email);
  }

  get registerButton() {
    return $(this.elements.registerButton);
  }

  async register(name, email) {
    await (await this.nameOrganization).click();
    await (await this.nameOrganization).setValue(name);
    await (await this.email).addValue(email);
    await (await this.registerButton).click();
  }
}

export default ApiPage;
