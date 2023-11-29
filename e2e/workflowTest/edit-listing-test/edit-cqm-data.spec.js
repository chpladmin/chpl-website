import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import LoginComponent from '../../components/login/login.po';

let hooks;
let login;
let page;

describe('On Listing details page', () => {
  beforeEach(async () => {
    page = new ListingPage();
    hooks = new Hooks();
    login = new LoginComponent();
  });

  describe('As ADMIN user ', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/10974');
      await login.logIn('admin');
      await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
    });

    it('should be able to view cqm data in new edit view on listing edit page', async () => {
      await page.newEditCertifiedProductButton();
      await hooks.waitForSpinnerToDisappear();
      await page.cqmLeftNavButton();
      await expect(await page.versionSelectHelperText()).toContain('At least one version must be selected');
    });
  });
});
