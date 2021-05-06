const reportingElements = {
  reportingTab: '//*[@heading="Reporting"]',
  year: '#year',
  range: '#range',
  donwloadResults: '//span[text()="Download Results"]',
};

class ManagePage {
  constructor () { }

  get reportingTab () {
    return $(reportingElements.reportingTab);
  }

  get year () {
    return $(reportingElements.year);
  }

  get range () {
    return $(reportingElements.range);
  }

  get donwloadResultsButton () {
    return $(reportingElements.donwloadResults);
  }

  chooseDropdownValue (value) {
    $('//*[@data-value="' + value + '"]').click();
  }

}

export default ManagePage;
