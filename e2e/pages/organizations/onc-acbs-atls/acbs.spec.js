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
    await browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    await browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new OrganizationPage();
    hooks = new Hooks();
    login = new LoginComponent();
    address = new AddressComponent();
    await open('#/resources/overview');
  });

  afterEach(async () => {
    await login.logOut();
  });

  describe('when logged in as SLI Compliance', () => {
    beforeEach(async () => {
      await login.logIn('sli');
      await page.open('onc-acbs');
      await (browser.waitUntil(async () => await (await page.getManageUsersPanelHeader()).isDisplayed()));
      await (browser.waitUntil(async () => ((await (await page.getManageUsersPanelHeaderUserCount()).getText()) !== '(0 users)')));
    });

    it('should allow user to edit SLI Compliance details', async () => {
      const acbId = '4';
      await (await page.getOrganizationEditButton()).click();
      await (await page.getOrganizationWebsite()).setValue(websiteUrl);
      await address.set(acbAddress);
      await (await page.getSaveOrganizationButton()).click();
      await hooks.waitForSpinnerToAppear();
      await hooks.waitForSpinnerToDisappear();
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain(websiteUrl);
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain(acbAddress.address);
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain(acbAddress.city);
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain(acbAddress.state);
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain(acbAddress.zip);
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain(acbAddress.country);
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open('onc-acbs');
      await (browser.waitUntil(async () => ((await page.organizationListCount()) > 0)));
    });

    it('should allow user to create a new ACB', async () => {
      const newAcbName = `${'Zacb-'}${timestamp}`;
      await page.createOrganization();
      await (await page.getOrganizationName()).addValue(newAcbName);
      await (await page.getOrganizationWebsite()).addValue(websiteUrl);
      await address.set(acbAddress);
      await (await page.getSaveOrganizationButton()).click();
      await hooks.waitForSpinnerToDisappear();
      await page.openOrganizationDetails(newAcbName);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(newAcbName);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(websiteUrl);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(acbAddress.address);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(acbAddress.city);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(acbAddress.state);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(acbAddress.zip);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(acbAddress.country);
    });
  });
});
