import AcbPage from './acbs.po';
import Hooks from '../../../utilities/hooks';
import LoginComponent from '../../../components/login/login.po';
import AddressComponent from '../../../components/address/address.po';

let hooks, page, login, address;

describe('the ONC-ACB Management page', () => {
    const timestamp = (new Date()).getTime();
    const websiteUrl = 'https://website' + timestamp + '.com';
    let today = new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
    const acbAddress = {
    address: 'address' + timestamp,
    city: 'city' + timestamp,
    state: 'state' + timestamp,
    zip: '11111' + timestamp,
    country: 'country' + timestamp,
    };

    beforeEach(async () => {
      browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
      browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
      page = new AcbPage();
      hooks = new Hooks();
      login = new LoginComponent();
      address = new AddressComponent();
      await hooks.open('#/organizations/onc-acbs');
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
	  let timestamp = (new Date()).getTime();
      let newAcbName = 'Zacb' + ' - ' + timestamp;
      page.acbCreatetButton.click();
      page.acbName.addValue(newAcbName);
      page.acbWebsite.addValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      page.acbNameButton(newAcbName).click();
      expect(page.acbGeneralInformation.getText()).toContain(newAcbName);
      expect(page.acbGeneralInformation.getText()).toContain(websiteUrl);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.address);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.city);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.state);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.zip);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.country);
    });

    it('should allow user to retire existing ACB', () => {
      let acb = 'CCHIT';
      page.acbNameButton(acb).click();
	  page.acbEditButton.click();
	  page.retireOrganizationCheckbox.click();
      page.acbWebsite.setValue(websiteUrl);
      address.set(acbAddress);
	  page.saveOrganizationButton.click();
      expect(page.retiredStatus.getText()).toContain('Retired: No');
     });

    it('should allow user to unretire existing ACB', () => {
      let acb = 'CCHIT';
      page.acbNameButton(acb).click();
      page.acbEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.retirementDate.setValue(today);
	  page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
	  expect(page.retiredStatus.getText()).toContain('Retired: Yes');
    });
  });
});
