import ListingPage from '../../pages/listing/listing.po';
import { open } from '../../utilities/hooks';
import LoginComponent from '../../components/login/login.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import ToastComponent from '../../components/toast/toast.po';
import ListingEditComponent from '../../components/listing/edit/listing-edit.po';
import RealWorldTestingPage from '../../pages/collections/real-world-testing/real-world-testing.po';

let action;
let login;
let page;
let searchPage;
let toast;
let listingEdit;

describe('On Listing details page', () => {
  beforeEach(async () => {
    listingEdit = new ListingEditComponent();
    page = new ListingPage();
    searchPage = new RealWorldTestingPage();
    toast = new ToastComponent();
    login = new LoginComponent();
    action = new ActionBarComponent();
  });

  describe('when changing CHPL Product Number data of a listing', () => {
    beforeEach(async () => {
      await open('#/listing/10804');
      await login.logIn('admin');
      await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
    });

    it('should show changes on the Listing page', async () => {
      const productCode = (`${Date.now()}`).substring(9);
      const versionCode = (`${Date.now()}`).substring(11);
      const initialChplProductNumber = page.chplProductNumber;

      await page.newEditCertifiedProductButton();
      await listingEdit.addChplProductNumberProductCode(productCode);
      await listingEdit.addChplProductNumberVersionCode(versionCode);
      await action.save();
      await (await (listingEdit.warningLabel)).click();
      await action.save();
      await expect(page.chplProductNumber).not.toContain(initialChplProductNumber);
    });
  });
});
