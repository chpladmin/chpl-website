const listingEditElements = {
  editcertifiedProduct: '#inspect-edit',
  testProcedureName: '//*[@id="testProcedures "]',
  allTestProcedureVersion: '*[id^="testProcedures-additional-input"]',
  testToolsName: '//*[@id="testTools "]',
  allTestToolsVersion: '*[id^="testTools-additional-input"]',
  testDataName: '//*[@id="testData "]',
  allTestDataVersion: '*[id^="testData-additional-input"]',
  testFunctionalityName: '*[id="testFunctionality "]',
  saveCertifiedProduct: 'button=Save Certification Criteria',
  closeListingEditButton: 'button.close.pull-right.ng-isolate-scope',
  yesConfirmation: '//button[text()="Yes"]',
  rwtPlansUrl: '#rwt-plans-url',
  rwtPlansCheckDate: '#rwt-plans-check-date',
  rwtResultsUrl: '#rwt-results-url',
  rwtResultsCheckDate: '#rwt-results-check-date',
};

class ListingEditComponent {
  constructor() { }

  get editcertifiedProduct() {
    return $(listingEditElements.editcertifiedProduct);
  }

  get testProcedureName() {
    return $(listingEditElements.testProcedureName);
  }

  get allTestProcedureVersion() {
    return $$(listingEditElements.allTestProcedureVersion);
  }

  get testToolsName() {
    return $(listingEditElements.testToolsName);
  }

  get allTestToolsVersion() {
    return $$(listingEditElements.allTestToolsVersion);
  }

  get testDataName() {
    return $(listingEditElements.testDataName);
  }

  get allTestDataVersion() {
    return $$(listingEditElements.allTestDataVersion);
  }

  get testFunctionalityName() {
    return $(listingEditElements.testFunctionalityName);
  }

  get saveCertifiedProduct() {
    return $(listingEditElements.saveCertifiedProduct);
  }

  get rwtPlansUrl() {
    return $(listingEditElements.rwtPlansUrl);
  }

  get rwtPlansCheckDate() {
    return $(listingEditElements.rwtPlansCheckDate);
  }

  get rwtResultsUrl() {
    return $(listingEditElements.rwtResultsUrl);
  }

  get rwtResultsCheckDate() {
    return $(listingEditElements.rwtResultsCheckDate);
  }

  get closeListingEditButton() {
    return $(listingEditElements.closeListingEditButton);
  }

  get yesConfirmation() {
    return $(listingEditElements.yesConfirmation);
  }

  openEditCriteria(editCriteriaId, cures) {
    this.editcertifiedProduct.click();
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${editCriteriaId}_details_header_cures"]`).$$('button')[1].click();
    } else {
      $(`//*[@id="criteria_${editCriteriaId}_details_header"]`).$$('button')[1].click();
    }
  }

  addTestProcedures(name, version) {
    this.testProcedureName.selectByVisibleText(name);
    const totalTestProc = this.allTestProcedureVersion.length;
    // This will get latest added test procedure version text box
    $(`//*[@id="testProcedures-additional-input-${totalTestProc - 1}"]`).addValue(version);
  }

  addTestFunctionality(name) {
    this.testFunctionalityName.selectByVisibleText(name);
  }

  addTestData(name, version) {
    this.testDataName.selectByVisibleText(name);
    const totalTestData = (this.allTestDataVersion.length) / 2;
    // This will get latest added test data version text box, alteration has same id so this below locator is different than test proc, tools
    $(`//*[@id="testData-additional-input-${totalTestData - 1}"]`).addValue(version);
  }

  addTestTools(name, version) {
    this.testToolsName.selectByVisibleText(name);
    const totalTestTools = this.allTestToolsVersion.length;
    // This will get latest added test tools version text box
    $(`//*[@id="testTools-additional-input-${totalTestTools - 1}"]`).addValue(version);
  }

  removeTestProcToolData(name) {
    $(`//span[text()="${name}"]/parent::button`).click();
  }

  viewDetailsCriteria(criteriaId, cures) {
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${criteriaId}_details_link_cures"]`).waitAndClick();
    } else {
      $(`//*[@id="criteria_${criteriaId}_details_link"]`).waitAndClick();
    }
  }

  closeEditListing() {
    this.closeListingEditButton.waitAndClick();
    this.yesConfirmation.waitAndClick();
    this.closeListingEditButton.waitAndClick();
    this.yesConfirmation.waitAndClick();
  }

  getTestFunctionalityDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Functionality_Tested_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Functionality_Tested"]`);
  }

  getTestDataDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Test_data_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Test_data"]`);
  }

  getTestToolDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Test_tool_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Test_tool"]`);
  }

  getTestProcedureDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Test_procedure_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Test_procedure"]`);
  }
}

export default ListingEditComponent;
