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
}

export default OrganizationPage;
