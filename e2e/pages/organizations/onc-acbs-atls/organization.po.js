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

  getOrganizationEditButton() {
    return $(this.elements.organizationEditButton);
  }

  getOrganizationName() {
    return $(this.elements.organizationName);
  }

  getOrganizationWebsite() {
    return $(this.elements.organizationWebsite);
  }

  getOrganizationLine1() {
    return $(this.elements.organizationLine1);
  }

  getNameErrorMessage() {
    return $(this.elements.nameErrorMessage);
  }

  getWebsiteErrorMessage() {
    return $(this.elements.websiteErrorMessage);
  }

  getLine1ErrorMessage() {
    return $(this.elements.line1ErrorMessage);
  }

  getManageUsersPanelHeader() {
    return $(this.elements.manageUsersPanelHeader);
  }

  getManageUsersPanelHeaderUserCount() {
    return $(this.elements.manageUsersPanelHeader).parentElement().nextElement();
  }

  getManageUsersPanel() {
    return $(this.elements.manageUsersPanelHeader).parentElement().parentElement().nextElement();
  }

  createOrganization() {
    $(this.elements.createButton).click();
  }

  getSaveOrganizationButton() {
    return $(this.elements.saveOrganizationButton);
  }

  openOrganizationDetails(name) {
    $(this.elements.navigationLink(name)).click();
  }
}

export default OrganizationPage;
