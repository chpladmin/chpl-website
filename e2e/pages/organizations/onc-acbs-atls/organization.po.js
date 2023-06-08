import { open as openPage } from '../../../utilities/hooks.async';

class OrganizationPage {
  constructor() {
    this.elements = {
      title: 'h1=ONC Organizations',
      navigationLinks: 'button[id^=onc-organizations-navigation-]',
      navigationLink: async (name) => `onc-organizations-navigation-${name}`,
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
    await (browser.waitUntil(async () => await (await $(this.elements.title)).isDisplayed()));
  }

  async organizationListCount() {
    const count = (await $$(this.elements.navigationLinks)).length;
    return count;
  }

  async getOrganizationEditButton() {
    return $(this.elements.organizationEditButton);
  }

  async getOrganizationName() {
    return $(this.elements.organizationName);
  }

  async getOrganizationWebsite() {
    return $(this.elements.organizationWebsite);
  }

  async getOrganizationLine1() {
    return $(this.elements.organizationLine1);
  }

  async getNameErrorMessage() {
    return $(this.elements.nameErrorMessage);
  }

  async getWebsiteErrorMessage() {
    return $(this.elements.websiteErrorMessage);
  }

  async getLine1ErrorMessage() {
    return $(this.elements.line1ErrorMessage);
  }

  async getManageUsersPanelHeader() {
    return $(this.elements.manageUsersPanelHeader);
  }

  async getManageUsersPanelHeaderUserCount() {
    return (await $(this.elements.manageUsersPanelHeader).parentElement()).nextElement();
  }

  async getManageUsersPanel() {
    return (await (await $(this.elements.manageUsersPanelHeader).parentElement()).parentElement()).nextElement();
  }

  async createOrganization() {
    await $(this.elements.createButton).click();
  }

  async getSaveOrganizationButton() {
    return $(this.elements.saveOrganizationButton);
  }

  async openOrganizationDetails(name) {
    await $(await this.elements.navigationLink(name)).click();
  }
}

export default OrganizationPage;
