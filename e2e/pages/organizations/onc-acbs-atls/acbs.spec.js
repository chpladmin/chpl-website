import OrganizationPage from './organizations.po';
import Hooks from '../../../utilities/hooks';
import LoginComponent from '../../../components/login/login.po';
import AddressComponent from '../../../components/address/address.po';

let address; let hooks; let login; let
  page;

describe('the ONC-ACB Management page', () => {
  const timestamp = (new Date()).getTime();
  const websiteUrl = `https://website${timestamp}.com`;
  const organizationType = 'ACB';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const acbAddress = {
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
    login = new LoginComponent();
    address = new AddressComponent();
    await hooks.open('#/organizations/onc-acbs');
  });

  describe('when logged in as an ACB', () => {
    beforeEach(() => {
      login.logIn('ul');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      const organizationName = 'UL LLC';
      page.organizationNameButton(organizationName).click();
      page.organizationEditButton.click();
      page.organizationName.setValue(organizationName);
      page.saveOrganizationButton.click();
      login.logOut();
    });

    it('should allow user to edit own ACB details', () => {
      const acb = 'UL LLC';
      const newAcbName = `${acb} - ${timestamp}`;
      const acbId = '1';
      page.organizationNameButton(acb).click();
      page.organizationEditButton.click();
      page.organizationName.setValue(newAcbName);
      page.organizationWebsite.setValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(newAcbName);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(websiteUrl);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.address);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.city);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.state);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.zip);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.country);
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

    it('should allow user to create a new ACB', () => {
      const newAcbName = `${'Zacb-'}${timestamp}`;
      page.createOrganizationButton('ACB').click();
      page.organizationName.addValue(newAcbName);
      page.organizationWebsite.addValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      page.organizationNameButton(newAcbName).click();
      expect(page.newOrganizationGeneralInfo.getText()).toContain(newAcbName);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(websiteUrl);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.address);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.city);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.state);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.zip);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.country);
    });

    it('should allow user to unretire and retire existing ACB', () => {
      const acb = 'CCHIT';
      const acbId = '2';
      page.organizationNameButton(acb).click();
      page.organizationEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.organizationWebsite.setValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      expect(page.retiredStatus(organizationType, acbId).getText()).toContain('Retired: No');
      hooks.open('#/organizations/onc-acbs');
      page.organizationNameButton(acb).click();
      page.organizationEditButton.click();
      hooks.waitForSpinnerToDisappear();
      page.retireOrganizationCheckbox.click();
      page.retirementDate.setValue(today);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      expect(page.retiredStatus(organizationType, acbId).getText()).toContain('Retired: Yes');
    });
  });
});
