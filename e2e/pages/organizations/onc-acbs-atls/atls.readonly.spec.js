import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.sync.po';
import ToastComponent from '../../../components/toast/toast.po';

import OrganizationPage from './organization.po';

let address;
let hooks;
let login;
let page;
let toast;

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
