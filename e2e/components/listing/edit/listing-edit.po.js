class ListingEditComponent {
  constructor() {
    this.elements = {
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
      chplProductNumberProdCode: '#id-prod',
      newChplProductNumberProdCode: '#product-code',
      chplProductNumberVerCode: '#id-ver',
      newChplProductNumberVerCode: '#version-code',
      warningLabel: 'span*=I have reviewed the warning and wish to proceed with this update',
      mandatoryDisclosures: '#mandatory-disclosures',
      reasonForChange: '#reason-for-change',
    };
  }

  get editcertifiedProduct() {
    return $(this.elements.editcertifiedProduct);
  }

  get testProcedureName() {
    return $(this.elements.testProcedureName);
  }

  get allTestProcedureVersion() {
    return $$(this.elements.allTestProcedureVersion);
  }

  get testToolsName() {
    return $(this.elements.testToolsName);
  }

  get allTestToolsVersion() {
    return $$(this.elements.allTestToolsVersion);
  }

  get testDataName() {
    return $(this.elements.testDataName);
  }

  get allTestDataVersion() {
    return $$(this.elements.allTestDataVersion);
  }

  get testFunctionalityName() {
    return $(this.elements.testFunctionalityName);
  }

  get saveCertifiedProduct() {
    return $(this.elements.saveCertifiedProduct);
  }

  get rwtPlansUrl() {
    return $(this.elements.rwtPlansUrl);
  }

  get rwtPlansCheckDate() {
    return $(this.elements.rwtPlansCheckDate);
  }

  get rwtResultsUrl() {
    return $(this.elements.rwtResultsUrl);
  }

  get rwtResultsCheckDate() {
    return $(this.elements.rwtResultsCheckDate);
  }

  get closeListingEditButton() {
    return $(this.elements.closeListingEditButton);
  }

  get yesConfirmation() {
    return $(this.elements.yesConfirmation);
  }

  get chplProductNumberProdCode() {
    return $(this.elements.chplProductNumberProdCode);
  }

  async addChplProductNumberProductCode(productCode) {
    await (await $(this.elements.newChplProductNumberProdCode)).click();
    await browser.keys(['Control', 'a']);
    await browser.keys(['Backspace']);
    await (await $(this.elements.newChplProductNumberProdCode)).setValue(productCode);
  }

  get chplProductNumberVerCode() {
    return $(this.elements.chplProductNumberVerCode);
  }

  async addChplProductNumberVersionCode(versionCode) {
    await (await $(this.elements.newChplProductNumberVerCode)).click();
    await browser.keys(['Control', 'a']);
    await browser.keys(['Backspace']);
    await (await $(this.elements.newChplProductNumberVerCode)).setValue(versionCode);
  }

  get warningLabel() {
    return $(this.elements.warningLabel);
  }

  async openEditCriteria(editCriteriaId, cures) {
    await this.editcertifiedProduct.click();
    if (cures) {
      // click on Edit for on the criteria
      await (await $(`//*[@id="criteria_${editCriteriaId}_details_header_cures"]`).$$('button'))[1].click();
    } else {
      await (await $(`//*[@id="criteria_${editCriteriaId}_details_header"]`).$$('button'))[1].click();
    }
  }

  async addTestProcedures(name, version) {
    await this.testProcedureName.selectByVisibleText(name);
    const totalTestProc = this.allTestProcedureVersion.length;
    // This will get latest added test procedure version text box
    await $(`//*[@id="testProcedures-additional-input-${totalTestProc - 1}"]`).addValue(version);
  }

  async addTestFunctionality(name) {
    await this.testFunctionalityName.selectByVisibleText(name);
  }

  async addTestData(name, version) {
    await this.testDataName.selectByVisibleText(name);
    const totalTestData = (this.allTestDataVersion.length) / 2;
    // This will get latest added test data version text box, alteration has same id so this below locator is different than test proc, tools
    await $(`//*[@id="testData-additional-input-${totalTestData - 1}"]`).addValue(version);
  }

  async addTestTools(name, version) {
    await this.testToolsName.selectByVisibleText(name);
    const totalTestTools = this.allTestToolsVersion.length;
    // This will get latest added test tools version text box
    await $(`//*[@id="testTools-additional-input-${totalTestTools - 1}"]`).addValue(version);
  }

  async removeTestProcToolData(name) {
    await $(`//span[text()="${name}"]/parent::button`).click();
  }

  async viewDetailsCriteria(criteriaId, cures) {
    if (cures) {
      // click on Edit for on the criteria
      await $(`//*[@id="criteria_${criteriaId}_details_link_cures"]`).waitAndClick();
    } else {
      await $(`//*[@id="criteria_${criteriaId}_details_link"]`).waitAndClick();
    }
  }

  async closeEditListing() {
    await this.closeListingEditButton.waitAndClick();
    await this.yesConfirmation.waitAndClick();
    await this.closeListingEditButton.waitAndClick();
    await this.yesConfirmation.waitAndClick();
  }

  async getTestFunctionalityDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Functionality_Tested_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Functionality_Tested"]`);
  }

  async getTestDataDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Test_data_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Test_data"]`);
  }

  async getTestToolDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Test_tool_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Test_tool"]`);
  }

  async getTestProcedureDetail(criteriaId, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaId}_details_row_Test_procedure_cures"]`);
    }
    return $(`//*[@id="criteria_${criteriaId}_details_row_Test_procedure"]`);
  }

  get reasonForChange() {
    return $(this.elements.reasonForChange);
  }

  get mandatoryDisclosures() {
    return $(this.elements.mandatoryDisclosures);
  }

}

export default ListingEditComponent;
