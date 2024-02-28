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

  async editCriteria(criteria) {
    await (await $(`button#criterion-id-${criteria}-edit`).$('span')).click();
  }

  get conformanceMethod() {
    return $(this.elements.conformanceMethodName);
  }

  get conformanceMethods() {
    return $(elementsOld.conformanceMethodName);
  }

  get testTools() {
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

  async chipText(text) {
    return $(`//span[text()="${text}"]`);
  }

  async expandRemovedCriteria() {
    await (await $(this.elements.removedCriteria).$$('div'))[1].click();
  }

  async expandCriteria(id) {
    await (await $(`#criterion-id-${id}-header`).$$('div'))[2].click();
  }

  async criteriaHeader(id) {
    return $(`#criterion-id-${id}-header`);
  }

  criteriaDetails(id) {
    return $(`#criterion-id-${id}-details`);
  }

  async criteriaCount() {
    return (await $$('//*[starts-with(@id,"criteri")] [contains(@id,"header")]')).length;
  }

  async criteriaDetailTable(id) {
    return $(`//*[@id="criterion-id-${id}-header"]/parent::div`).$('table');
  }

  async addItem(type) {
    await $(`#${type}-add-item`).click();
  }

  async checkItem(type) {
    await $(`#${type}-check-item`).click();
  }

  async choosePrivacySecurityFramework(value) {
    await $('#privacy-security-framework').click();
    await $(`//*[@data-value="${value}"]`).click();
  }

  async addConformanceMethods(name, version) {
    await this.addItem('conformance-methods');
    await $(this.elements.conformanceMethodName).scrollIntoView({ block: 'center', inline: 'center' });
    await $(this.elements.conformanceMethodName).click();
    await (await $('#menu-name').$(`li*=${name}`)).click();
    await $(this.elements.version).addValue(version);
    await this.checkItem('conformance-methods');
  }

  async addTestTools(name, version) {
    await this.addItem('test-tools');
    await $(this.elements.testToolsName).scrollIntoView({ block: 'center', inline: 'center' });
    await $(this.elements.testToolsName).click();
    await (await $('#menu-tt').$(`li*=${name}`)).click();
    await $(this.elements.version).addValue(version);
    await this.checkItem('test-tools');
  }

  async addPrivacySecurity(value) {
    await $(this.elements.privacySecurityName).scrollIntoView({ block: 'center', inline: 'center' });
    await $(this.elements.privacySecurityName).click();
    await $(`//*[@data-value="${value}"]`).click();
  }

  async editCriteriaButton(criteria, id) {
    return $(`//*[@id="criteria_${criteria}_details_header${id}"]`).$('button=Edit');
  }

  async openAttestedCriteria(criteria, id) {
    await (await $(`//*[@id="criteria_${criteria}_details_header${id}"]`).$('button=Edit')).click();
  }

  async openUnattestedCriteria(criteria, id) {
    await (await $(`//*[@id="criteria_${criteria}_details_header${id}"]`).$('button=Edit')).click();
  }

  async attestCriteria(criteria) {
    await $(`//*[@id="data${criteria}"]`).click();
  }

  async addConformanceMethodsOld(name, version) {
    await $(elementsOld.conformanceMethodName).selectByVisibleText(name);
    await $('//*[starts-with(@id,"conformanceMethods-additional-input")]').addValue(version);
  }

  async addTestToolsOld(name, version) {
    await $(elementsOld.testToolsName).selectByVisibleText(name);
    await $('//*[starts-with(@id,"testTools-additional-input")]').addValue(version);
  }

  get conformanceMethodDropdownOptions() {
    return this.conformanceMethods.$$('option');
  }

  get testToolsDropdownOptions() {
    return this.testTools.$$('option');
  }

  async closeItem(type) {
    await $(`#${type}-close-item`).click();
  }
}

export default CriteriaComponent;
