import Hooks from '../../../utilities/hooks';
import LoginComponent from '../../../components/login/login.sync.po';
import AddressComponent from '../../../components/address/address.po';
import { open } from '../../../utilities/hooks.async';

import OrganizationPage from './organization.po';

let address;
let hooks;
let login;
let page;

describe('the ONC-ACB Management page', () => {
  const timestamp = Date.now();
  const websiteUrl = `https://website${timestamp}.com`;
  const organizationType = 'ACB';
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
    await open('#/resources/overview');
  });

  afterEach(() => {
    login.logOut();
  });

  describe('when logged in as SLI Compliance', () => {
    beforeEach(async () => {
      await login.logIn('sli');
      await page.open('onc-acbs');
      await (browser.waitUntil(async () => (await page.manageUsersPanelHeader).isDisplayed()));
      await (browser.waitUntil(async () => (await page.manageUsersPanelHeaderUserCount.getText() !== '(0 users)')));
    });

    it('should allow user to edit SLI Compliance details', () => {
      const acbId = '4';
      page.organizationEditButton.click();
      page.organizationWebsite.setValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToAppear();
      hooks.waitForSpinnerToDisappear();
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(websiteUrl);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.address);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.city);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.state);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.zip);
      expect(page.generalInformation(organizationType, acbId).getText()).toContain(acbAddress.country);
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open('onc-acbs');
      await (browser.waitUntil(async () => (await page.organizationListCount() > 0)));
    });

    it('should allow user to create a new ACB', () => {
      const newAcbName = `${'Zacb-'}${timestamp}`;
      page.createOrganization();
      page.organizationName.addValue(newAcbName);
      page.organizationWebsite.addValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      page.openOrganizationDetails(newAcbName);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(newAcbName);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(websiteUrl);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.address);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.city);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.state);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.zip);
      expect(page.newOrganizationGeneralInfo.getText()).toContain(acbAddress.country);
    });
  });
});
