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
  beforeEach(async () => {
    page = new OrganizationPage();
    hooks = new Hooks();
    address = new AddressComponent();
    login = new LoginComponent();
    await open('#/resources/overview');
  });

  afterEach(async () => {
    await login.logOut();
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open('onc-acbs');
      await (browser.waitUntil(async () => ((await page.organizationListCount()) > 0)));
    });

    it('should have at least 7 ATL organizations', async () => {
      await expect(await page.organizationListCount()).toBeGreaterThanOrEqual(7);
    });

    // ignoring because "setValue" doesn't clear and set, just appends, which means all the validations go wrong
    xit('should allow user to unretire and retire existing ATL', async () => {
      const atl = 'CCHIT';
      const organizationType = 'ATL';
      const atlId = '2';
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

      await hooks.open('#/organizations/onc-atls');
      await hooks.waitForSpinnerToDisappear();
      await page.openOrganizationDetails(atl);
      await hooks.waitForSpinnerToDisappear();
      await (await page.getOrganizationEditButton()).click();
      await (await page.getRetireOrganizationCheckbox()).click();
      await (await page.getOrganizationWebsite()).setValue(websiteUrl);
      await address.set(atlAddress);
      await (await page.getSaveOrganizationButton()).click();
      await hooks.waitForSpinnerToDisappear();
      await expect(await (await page.generalInformation(organizationType, atlId)).getText()).toContain('Retired: No');
      await hooks.open('#/organizations/onc-atls');
      await hooks.waitForSpinnerToDisappear();
      await page.openOrganizationDetails(atl);
      await hooks.waitForSpinnerToDisappear();
      await (await page.getOrganizationEditButton()).click();
      await (await page.getRetireOrganizationCheckbox()).click();
      await (await page.getRetirementDate()).setValue(today);
      await (await page.getSaveOrganizationButton()).click();
      await hooks.waitForSpinnerToDisappear();
      await expect(await (await page.generalInformation(organizationType, atlId)).getText()).toContain('Retired: Yes');
    });
  });
});
