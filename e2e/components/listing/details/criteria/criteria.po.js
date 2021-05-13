import { element } from 'prop-types';

const elements = {
  removedCriteria: '#removed-header',
  attestToggle: '#success',
  accept: '//span[text()="Accept"]',
  testProcedureName: '#name',
  version: '#version',
  testToolsName: '#tt',
  privacySecurityName: '#privacy-security-framework',
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

  criteriaHeader(id) {
    return $(`#criterion-id-${id}-header`);
  }

  criteriaCount() {
    return $$('//*[starts-with(@id,"criterion-id")]').length;
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
}

export default CriteriaComponent;
