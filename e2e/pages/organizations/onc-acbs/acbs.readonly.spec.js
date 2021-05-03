import AcbPage from './acbs.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.po';

let hooks, page, address, login;

describe('the ONC-ACB Management page', () => {
    const timestamp = (new Date()).getTime();
    const websiteUrl = 'https://website' + timestamp + '.com';
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
      address = new AddressComponent();
      login = new LoginComponent();
      await hooks.open('#/organizations/onc-acbs');
    });

    it('should display all ACB organizations', () => {
	let expectedAcbs = ["ONC-ACBs", "CCHIT", "Drummond Group", "ICSA Labs", "SLI Compliance", "Surescripts LLC", "UL LLC"];
	let i;
	for (i=1; i<=6; i++) {
      expect(page.acbsList(i).getText()).toBe(expectedAcbs[i]);
      }
    });

    describe('when logged in as an ACB', () => {
      beforeEach(() => {
        login.logIn('ul');
        login.logoutButton.waitForDisplayed();
      });

      afterEach(() => {
        login.logOut();
      });

    it('should display registered users under the organization', () => {
      let acb = 'UL LLC';
      page.acbNameButton(acb).click();       
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('Role: ROLE_ACB');
      expect(page.manageUsersPanel.getText()).toContain('Organization: UL LLC');
    });

    it('should allow user to edit own ACB details', () => {
      let acb = 'UL LLC';
      let timestamp = (new Date()).getTime();
      let newAcbName = acb + ' - ' + timestamp;

      page.acbNameButton(acb).click();
      page.acbEditButton.click();
      page.acbName.setValue(newAcbName);
      page.acbWebsite.clearValue();
      page.acbWebsite.setValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      expect(page.acbGeneralInformation.getText()).toContain(newAcbName);
      expect(page.acbGeneralInformation.getText()).toContain(websiteUrl);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.address);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.city);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.state);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.zip);
      expect(page.acbGeneralInformation.getText()).toContain(acbAddress.country);
      page.acbEditButton.click();
      page.acbName.setValue(acb);
      page.saveOrganizationButton.click();
    });

    it('should require ACB Name, website and address on edit', () => {
      let acb = 'UL LLC';
      let timestamp = (new Date()).getTime();
      let newAcbName = acb + ' - ' + timestamp;

      page.acbNameButton(acb).click();
      page.acbEditButton.click();
      page.acbName.clearValue();
      expect(page.errorMessage.getText()).toBe('Field is required');
      page.acbName.setValue(newAcbName);
      page.acbWebsite.clearValue();
      expect(page.errorMessage.getText()).toBe('Field is required');
      page.acbWebsite.setValue(websiteUrl);
      address.editAddress.clearValue();
      expect(page.addressLine1errorMessage.getText()).toBe('Field is required');
    });

    it('should not present the option to edit ACB details other than own organization', () => {
      let acb = 'Drummond Group';
      page.acbNameButton(acb).click();
      expect(page.acbEditButton.isDisplayed()).toBe(false);
    });

    it('should not display registered users under the organization that is not their own', () => {
      let acb = 'Drummond Group';
      page.acbNameButton(acb).click();
      expect(page.manageUsersPanelHeader.isDisplayed()).toBe(false);
      });
    });
});
