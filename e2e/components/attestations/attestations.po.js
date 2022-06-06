class AttestationsComponent {
  constructor() {
    this.elements = {
      attestationsTable: 'table[aria-label="Developer Attestations information"',
      cancelExceptionButton: '#cancel-attestation-exception-button',
      createExceptionButton: '#create-attestation-exception-button',
      attestationsDetails: 'table[aria-label="Developer Attestations details"',
      closeDetailsButton: '#close-dialog',
    };
  }

  getAttestationSummary(identifier) {
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

  initiateAttestedException() {
    $(this.elements.createExceptionButton)
      .click();
  }

  get unattestedExceptionText() {
    return $(this.elements.createExceptionButton)
      .parentElement()
      .$('p')
      .getText();
  }

  get attestedExceptionText() {
    return $(this.elements.createExceptionButton)
      .parentElement()
      .$$('p')[1]
      .getText();
  }

  isCreatingException() {
    return $(this.elements.cancelExceptionButton).isDisplayed();
  }

  cancelException() {
    $(this.elements.cancelExceptionButton).click();
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
}

export default AttestationsComponent;
