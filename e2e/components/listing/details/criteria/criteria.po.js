// Old elements added intentionally so it would be easy to clean up later
const elementsOld = {
  saveCertifiedProduct: 'button=Save Certification Criteria',
  testProcedureName: '//*[@id="testProcedures "]',
  testToolsName: '//*[@id="testTools "]',
};

class CriteriaComponent {
  constructor() {
    this.elements = {
      removedCriteria: '#removed-header',
      attestToggle: '#success',
      accept: '//span[text()="Accept"]',
      testProcedureName: 'div#name',
      version: '#version',
      testToolsName: '#tt',
      privacySecurityName: '#privacy-security-framework',
    };
  }

  get removedCriteriaHeader() {
    return $(this.elements.removedCriteria);
  }

  editCriteria(id) {
    $(`#criterion-id-${id}-edit`).click();
  }

  get testProcedure() {
    return $(this.elements.testProcedureName);
  }

  get testProcedureOld() {
    return $(elementsOld.testProcedureName);
  }

  get attestToggle() {
    return $(this.elements.attestToggle);
  }

  get accept() {
    return $(this.elements.accept);
  }

  get saveCertifiedProductOld() {
    return $(elementsOld.saveCertifiedProduct);
  }

  chipText(text) {
    return $(`//span[text()="${text}"]`);
  }

  expandRemovedCriteria() {
    $(this.elements.removedCriteria).$$('div')[1].click();
  }

  uiUpgradeFlag() {
    return !$('chpl-certification-criteria').isExisting();
  }

  expandCriteria(id, criteria) {
    if (this.uiUpgradeFlag()) {
      $(`#criterion-id-${id}-header`).scrollIntoView();
      $(`#criterion-id-${id}-header`).$$('div')[1].click();
    } else {
      $(`//*[@id="criteria_${criteria}_details_link"]`).click();
    }
  }

  criteriaHeader(id, criteria, cures) {
    if (this.uiUpgradeFlag()) {
      return $(`#criterion-id-${id}-header`);
    }
    if (cures) {
      return $(`//*[@id="criteria_${criteria}_details_header_cures"]`);
    }
    return $(`//*[@id="criteria_${criteria}_details_header"]`);
  }

  criteriaCount() {
    return $$('//*[starts-with(@id,"criteri")] [contains(@id,"header")]').length;
  }

  criteriaDetailTable(id, criteria) {
    if (this.uiUpgradeFlag()) {
      return $(`//*[@id="criterion-id-${id}-header"]/parent::div`).$('table');
    }

    return $(`//*[@id="criteria_${criteria}_details_header"]/parent::div`).$('table');
  }

  addItem(type) {
    $(`#${type}-add-item`).click();
  }

  checkItem(type) {
    $(`#${type}-check-item`).click();
  }

  choosePrivacySecurityFramework(value) {
    $('#privacy-security-framework').click();
    $(`//*[@data-value="${value}"]`).click();
  }

  addTestProcedures(name, version) {
    this.addItem('test-procedures');
    $(this.elements.testProcedureName).scrollIntoView({ block: 'center', inline: 'center' });
    $(this.elements.testProcedureName).click();
    $('#menu-name').$(`li*=${name}`).click();
    $(this.elements.version).addValue(version);
    this.checkItem('test-procedures');
  }

  addTestTools(name, version) {
    this.addItem('test-tools');
    $(this.elements.testToolsName).scrollIntoView({ block: 'center', inline: 'center' });
    $(this.elements.testToolsName).click();
    $('#menu-tt').$(`li*=${name}`).click();
    $(this.elements.version).addValue(version);
    this.checkItem('test-tools');
  }

  addPrivacySecurity(value) {
    $(this.elements.privacySecurityName).scrollIntoView({ block: 'center', inline: 'center' });
    $(this.elements.privacySecurityName).click();
    $(`//*[@data-value="${value}"]`).click();
  }

  openAttestedCriteriaOld(editCriteriaId, cures) {
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${editCriteriaId}_details_header_cures"]`).$$('button')[1].click();
    } else {
      $(`//*[@id="criteria_${editCriteriaId}_details_header"]`).$$('button')[1].click();
    }
  }

  openUnattestedCriteriaOld(editCriteriaId, cures) {
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${editCriteriaId}_details_header_cures"]`).$('button').click();
    } else {
      $(`//*[@id="criteria_${editCriteriaId}_details_header"]`).$('button').click();
    }
  }

  attestCriteriaOld(criteria) {
    $(`//*[@id="data${criteria}"]`).click();
  }

  addTestProceduresOld(name, version) {
    $(elementsOld.testProcedureName).selectByVisibleText(name);
    $('//*[starts-with(@id,"testProcedures-additional-input")]').addValue(version);
  }

  addTestToolsOld(name, version) {
    $(elementsOld.testToolsName).selectByVisibleText(name);
    $('//*[starts-with(@id,"testTools-additional-input")]').addValue(version);
  }

  get testProcedureDropdownOptions () {
    return $('#menu-name').$$('li');
  }

  get testProcedureDropdownOptionsOld () {
    return this.testProcedureOld.$$('option');
  }
}

export default CriteriaComponent;
