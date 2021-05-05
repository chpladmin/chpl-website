import OrganizationPage from './organizations.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.po';
import ToastComponent from '../../../components/toast/toast.po';

let address; let hooks; let login; let page; let
  toast;

describe('the ONC-ATL Management page', () => {
  const timestamp = (new Date()).getTime();
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
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new OrganizationPage();
    hooks = new Hooks();
    address = new AddressComponent();
    login = new LoginComponent();
    toast = new ToastComponent();
    await hooks.open('#/organizations/onc-atls');
  });

  describe('when impersonating as an ATL', () => {
    beforeEach(() => {
      const userID = '41';
      login.logIn('onc');
      login.logoutButton.waitForDisplayed();
      hooks.open('#/users');
      page.impersonateUser(userID).scrollIntoView({ block: 'center', inline: 'center' });
      page.impersonateUser(userID).click();
      hooks.open('#/organizations/onc-atls');
    });

    afterEach(() => {
      const atl = 'UL LLC';
      page.organizationNameButton(atl).click();
      page.organizationEditButton.click();
      page.organizationName.setValue(atl);
      page.saveOrganizationButton.click();
      login.logOut();
    });

    it('should allow user to edit own ATL details', () => {
      const atl = 'UL LLC';
      const newAtlName = `${atl} - ${timestamp}`;
      const organizationType = 'ATL';
      const atlId = '1';
      page.organizationNameButton(atl).click();
      page.organizationEditButton.click();
      page.organizationName.setValue(newAtlName);
      page.organizationWebsite.setValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
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
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      login.logOut();
    });

    it('should allow user to Create a new ATL', () => {
      const newAtlName = `${'Zatl-'}${timestamp}`;
      page.createOrganizationButton('ATL').click();
      page.organizationName.addValue(newAtlName);
      page.organizationWebsite.addValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      toast.clearAllToast();
      page.organizationNameButton(newAtlName).click();
      expect(page.newOrganizationGeneralInfo.getText()).toContain(newAtlName);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(websiteUrl);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.address);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.city);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.state);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.zip);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(atlAddress.country);
    });

    it('should allow user to unretire and retire existing ATL', () => {
      const atl = 'CCHIT';
      const organizationType = 'ATL';
      const atlId = '2';
      hooks.open('#/organizations/onc-atls');
      page.organizationNameButton(atl).click();
      page.organizationEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.organizationWebsite.setValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
      expect(page.retiredStatus(organizationType, atlId).getText()).toContain('Retired: No');
      hooks.open('#/organizations/onc-atls');
      page.organizationNameButton(atl).click();
      page.organizationEditButton.click();
      hooks.waitForSpinnerToDisappear();
      page.retireOrganizationCheckbox.click();
      page.retirementDate.setValue(today);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      expect(page.retiredStatus(organizationType, atlId).getText()).toContain('Retired: Yes');
    });
  });
});
