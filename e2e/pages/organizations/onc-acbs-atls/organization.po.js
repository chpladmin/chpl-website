const elements = {
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

class OrganizationPage {
  constructor() { }

  organizationNameButton(organizationName) {
    return $(`//*[contains(text(),"${organizationName}")]`);
  }

  get organizationList() {
    return $(elements.organizationList);
  }

  organizationListCount() {
    return this.organizationList.length;
  }

  get organizationEditButton() {
    return $(elements.organizationEditButton);
  }

  createOrganizationButton(organization) {
    return $(`//*[contains(text(),"Create New ONC-${organization}")]`);
  }

  get organizationName() {
    return $(elements.organizationName);
  }

  get organizationWebsite() {
    return $(elements.organizationWebsite);
  }

  get saveOrganizationButton() {
    return $(elements.saveOrganizationButton);
  }

  get retireOrganizationCheckbox() {
    return $(elements.retireOrganization);
  }

  get retirementDate() {
    return $(elements.retirementDate);
  }

  get manageUsersPanelHeader() {
    return $(elements.manageUsersPanelHeader);
  }

  get manageUsersPanel() {
    return $('chpl-users');
  }

  get newOrganizationGeneralInfo() {
    return $('chpl-onc-organization');
  }

  generalInformation(organizationType, organizationId) {
    return $(`#chpl-organization-ONC-${organizationType}-${organizationId}`);
  }

  get errorMessage() {
    return $(elements.errorMessage);
  }

  get addressErrorMessage() {
    return $(elements.addressOnEdit);
  }
}

export default OrganizationPage;
