const elements = {
  organizationEditButton: '#edit-organization',
  organizationName: '#organization-name',
  organizationWebsite: '#organization-website',
  saveOrganizationButton: '#chpl-organization-save',
  organizationList: '.organizations-side-nav',
  retireOrganization: '#organization-retired',
  retirementDate: '#retirement-date',
  manageUsersPanelHeader: '//*[contains(text(),"Manage Users")]',
  errorMessage: '.text-danger.ng-scope',
  newOrganizationGeneralInfo: '//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[2]/div[1]/div[2]',
  addressLine1OnEdit: '//*[@id="chpl-organization-edit"]/div/chpl-address/span/span/div[1]/div[1]/div',
  manageUsersPanelBody: '//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[2]/div[2]/div[2]/chpl-users/span/div[2]',
};

class OrganizationPage {
  constructor() { }

  organizationNameButton(organizationName) {
    return $(`//*[contains(text(),"${organizationName}")]`);
  }

  get organizationList() {
    return $(elements.organizationList);
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
    return $(elements.manageUsersPanelBody);
  }

  get newOrganizationGeneralInfo() {
    return $(elements.newOrganizationGeneralInfo);
  }

  retiredStatus(organizationType, organizationId) {
    return $(`//*[@id="chpl-organization-ONC-${organizationType}-${organizationId}"]/ui-view/div/div`);
  }

  generalInformation(organizationType, organizationId) {
    return $(`//*[@id="chpl-organization-ONC-${organizationType}-${organizationId}"]`);
  }

  get errorMessage() {
    return $(elements.errorMessage);
  }

  get addressLine1errorMessage() {
    return $(elements.addressLine1OnEdit);
  }

  impersonateUser(userId) {
    return $(`//*[@id="user-component-impersonate-${userId}"]`);
  }
}

export default OrganizationPage;
