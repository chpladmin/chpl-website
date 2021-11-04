const reportingElements = {
  reportingTab: '//*[@heading="Reporting"]',
  year: '#year',
  quarter: '#quarter',
  downloadResults: '//span[text()="Download Results"]',
};

class ManagePage {
  get reportingTab() {
    return $(reportingElements.reportingTab);
  }

  get year() {
    return $(reportingElements.year);
  }

  get quarter() {
    return $(reportingElements.quarter);
  }

  get downloadResultsButton() {
    return $(reportingElements.downloadResults);
  }

  chooseDropdownValue(value) {
    $(`//*[@data-value="${value}"]`).click();
  }
}

export default ManagePage;
