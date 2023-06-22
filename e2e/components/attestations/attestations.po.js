class AttestationsComponent {
  constructor() {
    this.elements = {
      attestationsDetails: 'table[aria-label="Developer Attestations details"',
      attestationsTable: 'table[aria-label="Developer Attestations information"',
      cancelExceptionButton: '#cancel-attestation-exception-button',
      closeDetailsButton: '#close-dialog',
      createExceptionButton: '#create-attestation-exception-button',
      exceptionModalHeader: '#exception-details',
      nextButton: '#inspect-next',
      noncompliant: 'label=Noncompliant',
      signature: '#signature',
      submit: '#sign-electronically',
      submitAttestations: '#create-attestation-change-request-button',
    };
  }

  getAttestationSummary(identifier) {
    if (!$(this.elements.attestationsTable).isDisplayed()) {
      return undefined;
    }
    return $(this.elements.attestationsTable)
      .$$('tr')
      .find((row) => row.getText().includes(identifier))
      .$$('td')[1]
      .getText();
  }

  initiateUnattestedException(identifier) {
    $(this.elements.attestationsTable)
      .$$('tr')
      .find((row) => row.getText().includes(identifier))
      .$$('td')[2]
      .$('button')
      .click();
  }

  get exceptionText() {
    return $(this.elements.exceptionModalHeader)
      .parentElement()
      .$$('div')[1]
      .$('p')
      .getText();
  }

  isCreatingException() {
    return $(this.elements.cancelExceptionButton).isDisplayed();
  }

  cancelException() {
    $(this.elements.cancelExceptionButton).click();
  }

  createException() {
    $(this.elements.createExceptionButton).click();
  }

  viewAttestations(identifier) {
    $(this.elements.attestationsTable)
      .$$('tr')
      .find((row) => row.getText().includes(identifier))
      .$$('td')[2]
      .$('button')
      .click();
    browser.waitUntil(() => this.detailsAreDisplayed());
  }

  detailsAreDisplayed() {
    return $(this.elements.attestationsDetails).isDisplayed();
  }

  getAttestationResponse(condition) {
    return $(this.elements.attestationsDetails)
      .$$('tr')
      .find((row) => row.getText().includes(condition))
      .$$('td')[1]
      .getText();
  }

  closeAttestations() {
    $(this.elements.closeDetailsButton).click();
  }

  canSubmitAttestations() {
    return $(this.elements.submitAttestations).isEnabled();
  }

  initiateAttestationSubmission() {
    $(this.elements.submitAttestations).click();
  }

  nextStep() {
    $(this.elements.nextButton).click();
  }

  selectOptions() {
    $$(this.elements.noncompliant).forEach((item) => item.click());
  }

  sign(signature) {
    $(this.elements.signature).addValue(signature);
  }

  submit() {
    $(this.elements.submit).click();
  }
}

export default AttestationsComponent;
