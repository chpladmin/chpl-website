class AttestationsComponent {
  constructor() {
    this.elements = {
      attestationsTable: 'table[aria-label="Developer Attestations information"',
      cancelExceptionButton: '#cancel-attestation-exception-button',
      createExceptionButton: '#create-attestation-exception-button',
      attestationsDetails: 'table[aria-label="Developer Attestations details"',
      closeDetailsButton: '#close-dialog',
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
}

export default AttestationsComponent;
