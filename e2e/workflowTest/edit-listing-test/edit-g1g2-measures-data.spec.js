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
      await hooks.open('#/listing/10902');
      await login.logIn('admin');
      await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
    });

    it('should be able to see a button to add G1 G2 Measure on new edit screen on listing edit page', async () => {
      await page.newEditCertifiedProductButton();
      await page.g1g2MeasuresLeftNavButton();
      await expect(await (await page.addMeasuresButton()).isDisplayed()).toBe(true);
    });
  });
});
