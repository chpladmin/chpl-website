import ListingPage from '../../pages/listing/listing.po';
import { open } from '../../utilities/hooks';
import LoginComponent from '../../components/login/login.po';

let login;
let page;

describe('On Listing details page', () => {
  beforeEach(async () => {
    page = new ListingPage();
    login = new LoginComponent();
  });

  describe('As ADMIN user ', () => {
    beforeEach(async () => {
      await open('#/listing/10974');
      await login.logIn('admin');
      await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
    });

    it('should be able to view cqm data in new edit view on listing edit page', async () => {
      await page.newEditCertifiedProductButton();
      await page.cqmLeftNavButton();
      await expect(await page.versionSelectHelperText()).toContain('At least one version must be selected');
    });
  });
});
