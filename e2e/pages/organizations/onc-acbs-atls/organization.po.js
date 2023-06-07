import { open as openPage } from '../../../utilities/hooks.async';

class OrganizationPage {
  constructor() {
    this.elements = {
      title: 'h1=ONC Organizations',
      navigationLinks: 'button[id^=onc-organizations-navigation-]',
      navigationLink: (name) => `onc-organizations-navigation-${name}`,
      organizationEditButton: '#organization-component-edit',
      organizationName: '#name',
      organizationWebsite: '#website',
      organizationLine1: '#line1',
      nameErrorMessage: '#name-helper-text',
      websiteErrorMessage: '#website-helper-text',
      line1ErrorMessage: '#line1-helper-text',
      manageUsersPanelHeader: '//*[contains(text(),"Manage Users")]',
      createButton: '#create-new-organization',
      saveOrganizationButton: '#action-bar-save',
      /*
      organizationList: '.organizations-side-nav',
      retireOrganization: '#organization-retired',
      retirementDate: '#retirement-date',
      addressOnEdit: 'chpl-address',
      errorMessage: '.text-danger.ng-scope',
      */
    };
  }

  async open(org) {
    await openPage(`#/organizations/${org}`);
    await (browser.waitUntil(async () => (await $(this.elements.title)).isDisplayed()));
  }

  organizationListCount() {
    const count = $$(this.elements.navigationLinks).length;
    return count;
  }

  get organizationEditButton() {
    return $(this.elements.organizationEditButton);
  }

  get organizationName() {
    return $(this.elements.organizationName);
  }

  get organizationWebsite() {
    return $(this.elements.organizationWebsite);
  }

  get organizationLine1() {
    return $(this.elements.organizationLine1);
  }

  get nameErrorMessage() {
    return $(this.elements.nameErrorMessage);
  }

  get websiteErrorMessage() {
    return $(this.elements.websiteErrorMessage);
  }

  get line1ErrorMessage() {
    return $(this.elements.line1ErrorMessage);
  }

  get manageUsersPanelHeader() {
    return $(this.elements.manageUsersPanelHeader);
  }

  get manageUsersPanelHeaderUserCount() {
    return $(this.elements.manageUsersPanelHeader).parentElement().nextElement();
  }

  get manageUsersPanel() {
    return $(this.elements.manageUsersPanelHeader).parentElement().parentElement().nextElement();
  }

  createOrganization() {
    $(this.elements.createButton).click();
  }

  get saveOrganizationButton() {
    return $(this.elements.saveOrganizationButton);
  }

  openOrganizationDetails(name) {
    $(this.elements.navigationLink(name)).click();
  }
/*

  get organizationList() {
    return $(this.elements.organizationList);
  }

  get retireOrganizationCheckbox() {
    return $(this.elements.retireOrganization);
  }

  get retirementDate() {
    return $(this.elements.retirementDate);
  }

  get newOrganizationGeneralInfo() {
    return $('chpl-onc-organization');
  }

  generalInformation(organizationType, organizationId) {
    return $(`#chpl-organization-ONC-${organizationType}-${organizationId}`);
  }

  get addressErrorMessage() {
    return $(this.elements.addressOnEdit);
  }

  organizationListValue(key) {
    const keyValue = $(this.elements.organizationList).$$('.btn.btn-link')[key];
    return keyValue;
  }
  */
}

export default OrganizationPage;
