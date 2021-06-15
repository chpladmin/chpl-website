/* eslint-disable class-methods-use-this */
class OrganizationPage {
  constructor() {
    this.elements = {
      organizationEditButton: '#edit-organization',
      organizationName: '#organization-name',
      organizationWebsite: '#organization-website',
      saveOrganizationButton: '#chpl-organization-save',
      organizationList: '.organizations-side-nav',
      retireOrganization: '#organization-retired',
      retirementDate: '#retirement-date',
      addressOnEdit: 'chpl-address',
      manageUsersPanelHeader: '//*[contains(text(),"Manage Users")]',
      errorMessage: '.text-danger.ng-scope',
    };
  }

  organizationNameButton(organizationName) {
    return $(`//*[contains(text(),"${organizationName}")]`);
  }

  get organizationList() {
    return $(this.elements.organizationList);
  }

  organizationListCount() {
    const count = $(this.elements.organizationList).$$('.btn.btn-link').length;
    return count;
  }

  get organizationEditButton() {
    return $(this.elements.organizationEditButton);
  }

  createOrganizationButton(organization) {
    return $(`//*[contains(text(),"Create New ONC-${organization}")]`);
  }

  get organizationName() {
    return $(this.elements.organizationName);
  }

  get organizationWebsite() {
    return $(this.elements.organizationWebsite);
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
}

export default OrganizationPage;
