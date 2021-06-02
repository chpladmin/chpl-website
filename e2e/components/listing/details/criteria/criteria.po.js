const elements = {
  removedCriteria: '#removed-header',
  attestToggle: '#success',
  accept: '//span[text()="Accept"]',
  testProcedureName: '#name',
  version: '#version',
  testToolsName: '#tt',
  privacySecurityName: '#privacy-security-framework',
};

// Old elements added intentionally so it would be easy to clean up later
const elementsOld = {
  saveCertifiedProduct: 'button=Save Certification Criteria',
  testProcedureName: '//*[@id="testProcedures "]',
  testToolsName: '//*[@id="testTools "]',
};

class CriteriaComponent {
  constructor() { }

  get removedCriteriaHeader() {
    return $(elements.removedCriteria);
  }

  editCriteria(id) {
    $(`#criterion-id-${id}-edit`).scrollAndClick();
  }

  get attestToggle() {
    return $(elements.attestToggle);
  }

  get accept() {
    return $(elements.accept);
  }

  get saveCertifiedProductOld() {
    return $(elementsOld.saveCertifiedProduct);
  }

  chipText(text) {
    return $(`//span[text()="${text}"]`);
  }

  expandRemovedCriteria() {
    $(elements.removedCriteria).$$('div')[1].scrollAndClick();
  }

  expandCriteria(id) {
    $(`#criterion-id-${id}-header`).scrollIntoView();
    $(`#criterion-id-${id}-header`).$$('div')[1].scrollAndClick();
  }

  uiUpgradeFlag() {
    if ($('chpl-certification-criteria').isExisting()) {
      return false;
    }
    return true;
  }

  criteriaHeader(id, criteria, cures) {
    if (this.uiUpgradeFlag()) {
      return $(`#criterion-id-${id}-header`);
    }
    if (!this.uiUpgradeFlag()) {
      if (cures) {
        return $(`//*[@id="criteria_${criteria}_details_header_cures"]`);
      }
      return $(`//*[@id="criteria_${criteria}_details_header"]`);
    }
  }

  criteriaCount() {
    return $$('//*[starts-with(@id,"criterion-id")] [contains(@id,"header")]').length;
  }

  criteriaDetailTable(id) {
    return $(`//*[@id="criterion-id-${id}-header"]/parent::div`).$('table');
  }

  addItem(type) {
    $(`#${type}-add-item`).scrollAndClick();
  }

  checkItem(type) {
    $(`#${type}-check-item`).scrollAndClick();
  }

  choosePrivacySecurityFramework(value) {
    $('#privacy-security-framework').click();
    $(`//*[@data-value="${value}"]`).click();
  }

  addTestProcedures(name, version) {
    this.addItem('test-procedures');
    $(elements.testProcedureName).click();
    $('#menu-name').$(`li*=${name}`).click();
    $(elements.version).addValue(version);
    this.checkItem('test-procedures');
  }

  addTestTools(name, version) {
    this.addItem('test-tools');
    $(elements.testToolsName).click();
    $('#menu-tt').$(`li*=${name}`).click();
    $(elements.version).addValue(version);
    this.checkItem('test-tools');
  }

  addPrivacySecurity(value) {
    $(elements.privacySecurityName).click();
    $(`//*[@data-value="${value}"]`).click();
  }

  openAttestedCriteriaOld(editCriteriaId, cures) {
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${editCriteriaId}_details_header_cures"]`).$$('button')[1].scrollAndClick();
    } else {
      $(`//*[@id="criteria_${editCriteriaId}_details_header"]`).$$('button')[1].scrollAndClick();
    }
  }

  openUnattestedCriteriaOld(editCriteriaId, cures) {
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${editCriteriaId}_details_header_cures"]`).$('button').scrollAndClick();
    } else {
      $(`//*[@id="criteria_${editCriteriaId}_details_header"]`).$('button').scrollAndClick();
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
}

export default CriteriaComponent;
