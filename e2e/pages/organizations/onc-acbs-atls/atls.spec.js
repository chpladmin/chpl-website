import OrganizationPage from './organization.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.sync.po';
import ToastComponent from '../../../components/toast/toast.po';
import UsersComponent from '../../../components/users/users.po';

let address;
let hooks;
let login;
let page;
let toast;
let user;

describe('the ONC-ATL Management page', () => {
  const timestamp = Date.now();
  const websiteUrl = `http://www.example${timestamp}.com`;
  const atlAddress = {
    address: `address${timestamp}`,
    city: `city${timestamp}`,
    state: `state${timestamp}`,
    zip: `11111${timestamp}`,
    country: `country${timestamp}`,
  };

  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new OrganizationPage();
    hooks = new Hooks();
    address = new AddressComponent();
    login = new LoginComponent();
    toast = new ToastComponent();
    user = new UsersComponent();
    await hooks.open('#/organizations/onc-atls');
  });

  describe('when impersonating as ROLE_ATL for drummond group', () => {
    const atl = 'Drummond Group';
    beforeEach(() => {
      login.logIn('onc');
      hooks.open('#/organizations/onc-atls');
      hooks.waitForSpinnerToDisappear();
      page.openOrganizationDetails(atl);
      user.impersonateUser('Jim Dow');
    });

    afterEach(() => {
      page.openOrganizationDetails(atl);
      page.organizationEditButton.click();
      page.organizationName.setValue(atl);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil (() => toast.toastTitle.isDisplayed())
      toast.clearAllToast();
      login.logOut();
    });

    it('should allow user to edit drummond\'s details', () => {
      const newAtlName = `${atl} - ${timestamp}`;
      const organizationType = 'ATL';
      const atlId = '3';
      page.openOrganizationDetails(atl);
      page.organizationEditButton.click();
      page.organizationName.setValue(newAtlName);
      page.organizationWebsite.setValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil (() => toast.toastTitle.isDisplayed())
      toast.clearAllToast();
      expect(page.generalInformation(organizationType, atlId).getText()).toContain(newAtlName);
      expect(page.generalInformation(organizationType, atlId).getText()).toContain(websiteUrl);
      expect(page.generalInformation(organizationType, atlId).getText()).toContain(atlAddress.address);
      expect(page.generalInformation(organizationType, atlId).getText()).toContain(atlAddress.city);
      expect(page.generalInformation(organizationType, atlId).getText()).toContain(atlAddress.state);
      expect(page.generalInformation(organizationType, atlId).getText()).toContain(atlAddress.zip);
      expect(page.generalInformation(organizationType, atlId).getText()).toContain(atlAddress.country);
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
    });

    afterEach(() => {
      login.logOut();
    });

    it('should allow user to Create a new ATL', () => {
      const newAtlName = `${'Zatl-'}${timestamp}`;
      page.createOrganization('ATL');
      page.organizationName.addValue(newAtlName);
      page.organizationWebsite.addValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      page.openOrganizationDetails(newAtlName);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(newAtlName);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(websiteUrl);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.address);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.city);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.state);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.zip);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.country);
    });
  });
});
