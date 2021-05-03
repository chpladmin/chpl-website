const elements = {
  acbEditButton: '#edit-organization',
  acbName: '#organization-name',
  acbWebsite: '#organization-website',
  saveOrganizationButton: '#chpl-organization-save',
  retireOrganization: '#organization-retired',
  retirementDate: '#retirement-date',
  retiredStatus: '//*[@id="chpl-organization-ONC-ACB-2"]/ui-view/div/div',
  acbCreatetButton: '//*[contains(text(),"Create New ONC-ACB")]',
  manageUsersPanelHeader: '//*[contains(text(),"Manage Users")]',
  acbGeneralInformationPanel: '//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[2]/div[1]/div[2]',
  manageUsersPanelBody: '//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[2]/div[2]/div[2]/chpl-users/span/div[2]',
  errorMessage: '.text-danger.ng-scope',
  addressLine1OnEdit: '//*[@id="chpl-organization-edit"]/div/chpl-address/span/span/div[1]/div[1]/div'
};

class AcbPage {
  constructor () { }

  acbNameButton (acb) {
   return $('//*[contains(text(),"' + acb + '")]');
  }

  acbsList (acb) {
    return $('//*[@id="main-content"]/div/div/ui-view/chpl-onc-organizations/div[2]/div[1]/div/div/div[' + acb + ']/button');
  }

  get acbEditButton () {
    return $(elements.acbEditButton);
  }

  get acbCreatetButton () {
    return $(elements.acbCreatetButton);
  }
 
  get acbName () {
    return $(elements.acbName);
  }

  get acbWebsite () {
    return $(elements.acbWebsite);
  }

  get saveOrganizationButton () {
    return $(elements.saveOrganizationButton);
  }

  get retireOrganizationCheckbox () {
    return $(elements.retireOrganization);
  }

  get retirementDate () {
    return $(elements.retirementDate);
  }

  get manageUsersPanelHeader () {
    return $(elements.manageUsersPanelHeader);
  }

  get manageUsersPanel () {
    return $(elements.manageUsersPanelBody);
  }

  get retiredStatus () {
    return $(elements.retiredStatus);
  }

  get acbGeneralInformation () {
    return $(elements.acbGeneralInformationPanel);
  }

  get errorMessage () {
    return $(elements.errorMessage);
  }

  get addressLine1errorMessage () {
    return $(elements.addressLine1OnEdit);
  }
}

export default AcbPage;
