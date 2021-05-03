const elements = {
  atlEditButton: '#edit-organization',
  atlName: '#organization-name',
  atlWebsite: '#organization-website',
  saveOrganizationButton: '#chpl-organization-save',
  retireOrganization: '#organization-retired',
  retirementDate: '#retirement-date',
  retiredStatus: '//*[@id="chpl-organization-ONC-ATL-2"]/ui-view/div',
  atlCreatetButton: '//*[contains(text(),"Create New ONC-ATL")]',
  manageUsersPanelHeader: '//*[contains(text(),"Manage Users")]',
  ulButton: '//*[contains(text(),"UL LLC")]',
  drummondButton: '//*[contains(text(),"Drummond Group")]',
  cchitButton: '//*[contains(text(),"CCHIT")]',
  impersonateUserComponent: '//*[@id="user-component-impersonate-41"]',
  atlGeneralInformation: '//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[2]/div[1]/div[2]',
  manageUsersPanelBody: '//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[2]/div[2]/div[2]/chpl-users/span/div[2]'
};

class AtlPage {
  constructor () { }

  atlNameButton (atl) {
   return $('//*[contains(text(),"' + atl + '")]');
  }
  
  atlsList (atl) {
    return $('//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[1]/div/div/div[' + atl + ']/button');
  }

  get atlEditButton() {
	return $(elements.atlEditButton);
  }

  get atlCreatetButton() {
	return $(elements.atlCreatetButton);
  }

  get atlName() {
	return $(elements.atlName);
  }

  get atlWebsite() {
	return $(elements.atlWebsite);
  }

  get retireOrganizationCheckbox() {
	return $(elements.retireOrganization);
  }

  get retirementDate() {
	return $(elements.retirementDate);
  }

  get saveOrganizationButton() {
	return $(elements.saveOrganizationButton);
  }

  retiredStatus(id) {
	return $('//*[@id="chpl-organization-ONC-ATL-' + id + '"]/ui-view/div/div');
  }

   get retiredStatus() {
	return $(elements.retiredStatus);
  }

  get impersonateUser() {
	return $(elements.impersonateUserComponent);
  }  

   get manageUsersPanelHeader() {
	return $(elements.manageUsersPanelHeader);
  }

  get manageUsersPanel () {
    return $(elements.manageUsersPanelBody);
  }

  get atlGeneralInformation() {
	return $(elements.atlGeneralInformation);
  }
}

export default AtlPage;
