import OrganizationPage from './organizations.po';
import Hooks from '../../../utilities/hooks';
import LoginComponent from '../../../components/login/login.po';

let hooks; let login; let
  page;

describe('the ONC-ATL Management page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new OrganizationPage();
    hooks = new Hooks();
    login = new LoginComponent();
    await hooks.open('#/organizations/onc-atls');
  });

  it('should display all ATL organizations', () => {
    const expectedAtls = ['ONC-ATLs', 'CCHIT', 'Drummond Group', 'ICSA Labs', 'National Committee for Quality Assurance (NCQA)', 'National Technical Systems', 'SLI Compliance', 'UL LLC'];
    let i;
    for (i = 1; i <= 7; i += 1) {
      expect(page.organizationList.getText()).toContain(expectedAtls[i]);
    }
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
      login.logOut();
    });

    it('should display registered users under the organization', () => {
      const atl = 'UL LLC';
      page.organizationNameButton(atl).click();
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('Role: ROLE_ATL');
      expect(page.manageUsersPanel.getText()).toContain('Organization: UL LLC');
    });

    it('should not present the option to edit ATL details other than own', () => {
      const atl = 'Drummond Group';
      page.organizationNameButton(atl).click();
      expect(page.organizationEditButton.isDisplayed()).toBe(false);
    });

    it('should not display registered users under the organization that is not their own ', () => {
      const atl = 'Drummond Group';
      page.organizationNameButton(atl).click();
      expect(page.manageUsersPanelHeader.isDisplayed()).toBe(false);
    });
  });
});
