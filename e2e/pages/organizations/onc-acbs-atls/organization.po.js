import { open as openPage } from '../../../utilities/hooks.async';

class OrganizationPage {
  constructor() {
    this.elements = {
      title: 'h1=ONC Organizations',
      navigationLinks: 'button[id^=onc-organizations-navigation-]',
      organizationEditButton: '#organization-component-edit',
      organizationName: '#name',
      organizationWebsite: '#website',
      /*
      manageUsersPanelHeader: '//*[contains(text(),"Manage Users")]',
      saveOrganizationButton: '#chpl-organization-save',
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
/*
  openOrganizationDetails(organizationName) {
    $(`//*[contains(text(),"${organizationName}")]`).click();
  }

  get organizationList() {
    return $(this.elements.organizationList);
  }



  createOrganization(organization) {
    $(`//*[contains(text(),"Create New ONC-${organization}")]`).click();
  }


  get saveOrganizationButton() {
    return $(this.elements.saveOrganizationButton);
  }

  get retireOrganizationCheckbox() {
    return $(this.elements.retireOrganization);
  }

  get retirementDate() {
    return $(this.elements.retirementDate);
  }

  get manageUsersPanelHeader() {
    return $(this.elements.manageUsersPanelHeader);
  }

  get manageUsersPanel() {
    return $('chpl-users-bridge');
  }

  get newOrganizationGeneralInfo() {
    return $('chpl-onc-organization');
  }

  generalInformation(organizationType, organizationId) {
    return $(`#chpl-organization-ONC-${organizationType}-${organizationId}`);
  }

  get errorMessage() {
    return $(this.elements.errorMessage);
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
