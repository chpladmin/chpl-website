import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.sync.po';
import UsersComponent from '../../../components/users/users.po';
import ToastComponent from '../../../components/toast/toast.po';

import OrganizationPage from './organization.po';

let address;
let hooks;
let login;
let page;
let toast;
let user;

describe('the ONC-ATL Management page', () => {
  const timestamp = Date.now();
  const websiteUrl = `http://www.example${timestamp}.com`;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const atlAddress = {
    address: `address${timestamp}`,
    city: `city${timestamp}`,
    state: `state${timestamp}`,
    zip: `11111${timestamp}`,
    country: `country${timestamp}`,
  };

  beforeEach(async () => {
    page = new OrganizationPage();
    hooks = new Hooks();
    login = new LoginComponent();
    address = new AddressComponent();
    user = new UsersComponent();
    toast = new ToastComponent();
    await hooks.open('#/organizations/onc-atls');
  });

  it('should have at least 7 ATL organizations', () => {
    expect(page.organizationListCount()).toBeGreaterThanOrEqual(7);
  });

  it('should display ATL organizations in alphabetical order', () => {
    const atlCount = page.organizationListCount();
    let i;
    for (i = 1; i < atlCount; i += 1) {
      expect(page.organizationListValue(i - 1).getText()).toBeLessThan(page.organizationListValue(i).getText());
    }
  });

  describe('when impersonating as ROLE_ATL for drummond group', () => {
    beforeEach(() => {
      login.logIn('onc');
      hooks.open('#/organizations/onc-atls');
      hooks.waitForSpinnerToDisappear();
      page.openOrganizationDetails('Drummond Group');
      user.impersonateUser('Jim Dow');
      hooks.open('#/organizations/onc-atls'); // added to avoid 404 page not found error
    });

    afterEach(() => {
      login.logOut();
    });

    it('should display registered users under Drummond', () => {
      const atl = 'Drummond Group';
      page.openOrganizationDetails(atl);
      hooks.waitForSpinnerToDisappear();
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('ROLE_ATL');
      expect(page.manageUsersPanel.getText()).toContain('Drummond Group');
    });

    it('should not display the option to edit ATL details for ICSA Labs', () => {
      const atl = 'ICSA Labs';
      const atlId = '5';
      page.openOrganizationDetails(atl);
      browser.waitUntil(() => page.generalInformation('ATL', atlId).isDisplayed());
      expect(page.organizationEditButton.isDisplayed()).toBe(false);
    });

    it('should not display registered users under ICSA Labs', () => {
      const atl = 'ICSA Labs';
      const atlId = '5';
      page.openOrganizationDetails(atl);
      browser.waitUntil(() => page.generalInformation('ATL', atlId).isDisplayed());
      expect(page.manageUsersPanelHeader.isDisplayed()).toBe(false);
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
    });

    afterEach(() => {
      login.logOut();
    });

    it('should allow user to unretire and retire existing ATL', () => {
      const atl = 'CCHIT';
      const organizationType = 'ATL';
      const atlId = '2';
      hooks.open('#/organizations/onc-atls');
      hooks.waitForSpinnerToDisappear();
      page.openOrganizationDetails(atl);
      hooks.waitForSpinnerToDisappear();
      page.organizationEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.organizationWebsite.setValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      toast.clearAllToast();
      expect(page.generalInformation(organizationType, atlId).getText()).toContain('Retired: No');
      hooks.open('#/organizations/onc-atls');
      hooks.waitForSpinnerToDisappear();
      page.openOrganizationDetails(atl);
      hooks.waitForSpinnerToDisappear();
      page.organizationEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.retirementDate.setValue(today);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastContainer.isDisplayed());
      toast.clearAllToast();
      expect(page.generalInformation(organizationType, atlId).getText()).toContain('Retired: Yes');
    });
  });
});
