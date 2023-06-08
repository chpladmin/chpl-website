import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.sync.po';
import { open } from '../../../utilities/hooks.async';

import OrganizationPage from './organization.po';

let address;
let hooks;
let login;
let page;

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

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open('onc-atls');
      await (browser.waitUntil(async () => ((await page.organizationListCount()) > 0)));
    });

    it('should allow user to Create a new ATL', async () => {
      const newAtlName = `${'Zatl-'}${timestamp}`;
      await page.createOrganization('ATL');
      await (await page.getOrganizationName()).addValue(newAtlName);
      await (await page.getOrganizationWebsite()).addValue(websiteUrl);
      await address.set(atlAddress);
      await (await page.getSaveOrganizationButton()).click();
      await hooks.waitForSpinnerToDisappear();
      await page.openOrganizationDetails(newAtlName);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(newAtlName);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(websiteUrl);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(atlAddress.address);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(atlAddress.city);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(atlAddress.state);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(atlAddress.zip);
      await expect(await (await page.getNewOrganizationGeneralInfo()).getText()).toContain(atlAddress.country);
    });
  });
});
