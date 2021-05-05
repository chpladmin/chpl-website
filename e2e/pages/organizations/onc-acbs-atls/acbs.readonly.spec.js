import OrganizationPage from './organizations.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.po';

let address; let hooks; let login; let
  page;

describe('the ONC-ACB Management page', () => {
  const timestamp = (new Date()).getTime();
  const websiteUrl = `https://website${timestamp}.com`;

  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new OrganizationPage();
    hooks = new Hooks();
    address = new AddressComponent();
    login = new LoginComponent();
    await hooks.open('#/organizations/onc-acbs');
  });

  it('should display all ACB organizations', () => {
    const expectedAcbs = ['ONC-ACBs', 'CCHIT', 'Drummond Group', 'ICSA Labs', 'SLI Compliance', 'Surescripts LLC', 'UL LLC'];
    let i;
    for (i = 1; i <= 6; i += 1) {
      expect(page.organizationList.getText()).toContain(expectedAcbs[i]);
    }
  });

  describe('when logged in as an ACB', () => {
    beforeEach(() => {
      login.logIn('ul');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      login.logOut();
    });

    it('should display registered users under the organization', () => {
      const acb = 'UL LLC';
      page.organizationNameButton(acb).click();
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('Role: ROLE_ACB');
      expect(page.manageUsersPanel.getText()).toContain('Organization: UL LLC');
    });

    it('should show errors for missing inputs in required fields ACB Name, website and address on ACB edit', () => {
      const acb = 'UL LLC';
      const newAcbName = `${acb} - ${timestamp}`;

      page.organizationNameButton(acb).click();
      page.organizationEditButton.click();
      page.organizationName.clearValue();
      expect(page.errorMessage.getText()).toBe('Field is required');
      page.organizationName.setValue(newAcbName);
      page.organizationWebsite.clearValue();
      expect(page.errorMessage.getText()).toBe('Field is required');
      page.organizationWebsite.setValue(websiteUrl);
      address.editAddress.clearValue();
      expect(page.addressLine1errorMessage.getText()).toBe('Field is required');
    });

    it('should not present the option to edit ACB details other than own organization', () => {
      const acb = 'Drummond Group';
      page.organizationNameButton(acb).click();
      expect(page.organizationEditButton.isDisplayed()).toBe(false);
    });

    it('should not display registered users under the organization that is not their own', () => {
      const acb = 'Drummond Group';
      page.organizationNameButton(acb).click();
      expect(page.manageUsersPanelHeader.isDisplayed()).toBe(false);
    });
  });
});
