// Old elements added intentionally so it would be easy to clean up later
const elementsOld = {
  saveCertifiedProduct: 'button=Save Certification Criteria',
  conformanceMethodName: '//*[@id="conformanceMethods "]',
  testToolsName: '//*[@id="testTools "]',
};

class CriteriaComponent {
  constructor() {
    this.elements = {
      removedCriteria: '#removed-header',
      attestToggle: '#success',
      accept: '//span[text()="Accept"]',
      conformanceMethodName: 'div#cm',
      version: '#version',
      testToolsName: 'div#tt',
      privacySecurityName: '#privacy-security-framework',
    };
  }

  get removedCriteriaHeader() {
    return $(this.elements.removedCriteria);
  }

  editCriteria(criteriaOld) {
    $(`button#criterion-id-${criteriaOld}-edit`).$('span').click();
  }

  get conformanceMethod() {
    return $(this.elements.conformanceMethodName);
  }

  get testTools() {
    return $(this.elements.testToolsName);
  }

  get conformanceMethodsOld() {
    return $(elementsOld.conformanceMethodName);
  }

  get testToolsOld() {
    return $(elementsOld.testToolsName);
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
    $(this.elements.removedCriteria).$$('div')[1].scrollIntoView();
    $(this.elements.removedCriteria).$$('div')[1].click();
  }

  expandCriteria(id) {
    $(`#criterion-id-${id}-header`).scrollIntoView({ block: 'center', inline: 'center' });
    $(`#criterion-id-${id}-header`).$$('div')[2].click();
  }

  criteriaHeader(id) {
    return $(`#criterion-id-${id}-header`);
  }

  criteriaCount() {
    return $$('//*[starts-with(@id,"criteri")] [contains(@id,"header")]').length;
  }

  criteriaDetailTable(id) {
    return $(`//*[@id="criterion-id-${id}-header"]/parent::div`).$('table');
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

  addConformanceMethods(name, version) {
    this.addItem('conformance-methods');
    $(this.elements.conformanceMethodName).scrollIntoView({ block: 'center', inline: 'center' });
    $(this.elements.conformanceMethodName).click();
    $('#menu-name').$(`li*=${name}`).click();
    $(this.elements.version).addValue(version);
    this.checkItem('conformance-methods');
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

  editCriteriaOldButton(criteriaOld, cures) {
    if (cures) {
      return $(`//*[@id="criteria_${criteriaOld}_details_header_cures"]`).$('button=Edit');
    }
    return $(`//*[@id="criteria_${criteriaOld}_details_header"]`).$('button=Edit');
  }

  openAttestedCriteriaOld(criteriaOld, cures) {
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${criteriaOld}_details_header_cures"]`).$('button=Edit').click();
    } else {
      $(`//*[@id="criteria_${criteriaOld}_details_header"]`).$('button=Edit').click();
    }
  }

  openUnattestedCriteriaOld(criteriaOld, cures) {
    if (cures) {
      // click on Edit for on the criteria
      $(`//*[@id="criteria_${criteriaOld}_details_header_cures"]`).$('button=Edit').click();
    } else {
      $(`//*[@id="criteria_${criteriaOld}_details_header"]`).$('button=Edit').click();
    }
  }

  attestCriteriaOld(criteria) {
    $(`//*[@id="data${criteria}"]`).click();
  }

  addConformanceMethodsOld(name, version) {
    $(elementsOld.conformanceMethodName).selectByVisibleText(name);
    $('//*[starts-with(@id,"conformanceMethods-additional-input")]').addValue(version);
  }

  addTestToolsOld(name, version) {
    $(elementsOld.testToolsName).selectByVisibleText(name);
    $('//*[starts-with(@id,"testTools-additional-input")]').addValue(version);
  }

  get conformanceMethodDropdownOptions() {
    return $('#menu-name').$$('li');
  }

  get testToolsDropdownOptions() {
    return $('#menu-tt').$$('li');
  }

  get conformanceMethodDropdownOptionsOld() {
    return this.conformanceMethodsOld.$$('option');
  }

  get testToolsDropdownOptionsOld() {
    return this.testToolsOld.$$('option');
  }

  closeItem(type) {
    $(`#${type}-close-item`).click();
  }
}

export default CriteriaComponent;
