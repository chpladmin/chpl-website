import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import LoginComponent from '../../components/login/login.po';
import ActionBarComponent from '../../components/action-bar/action-bar.async.po';
import ToastComponent from '../../components/toast/toast.po';
import ListingEditComponent from '../../components/listing/edit/listing-edit.po';
import RealWorldTestingPage from '../../pages/collections/real-world-testing/real-world-testing.po';

let action;
let hooks;
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
    hooks = new Hooks();
    toast = new ToastComponent();
    login = new LoginComponent();
    action = new ActionBarComponent();
  });

  describe('when changing CHPL Product Number data of a listing', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/10804');
      await login.logIn('admin');
      await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
    });

    it('should show changes on the Listing page', async () => {
      const productCode = (`${Date.now()}`).substring(9);
      const versionCode = (`${Date.now()}`).substring(11);
      const initialChplProductNumber = page.chplProductNumber;

      await page.newEditCertifiedProductButton();
      await hooks.waitForSpinnerToDisappear();
      await listingEdit.addChplProductNumberProductCode(productCode);
      await listingEdit.addChplProductNumberVersionCode(versionCode);
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await (await (listingEdit.warningLabel)).click();
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await expect(page.chplProductNumber).not.toContain(initialChplProductNumber);
    });
  });

  xdescribe('when changing CHPL Product Number data of 2015 edition listing', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/9902');
    });

    it('should show changes on the Listing page', async () => {
      const productCode = (`${Date.now()}`).substring(9);
      const versionCode = (`${Date.now()}`).substring(11);
      const initialChplProductNumber = page.chplProductNumber;

      await login.logIn('drummond');
      await page.editCertifiedProduct.click();
      await hooks.waitForSpinnerToDisappear();
      await listingEdit.chplProductNumberProdCode.doubleClick();
      await listingEdit.chplProductNumberProdCode.addValue(productCode);
      await listingEdit.chplProductNumberVerCode.doubleClick();
      await listingEdit.chplProductNumberVerCode.addValue(versionCode);
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await listingEdit.warningLabel.click();
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await browser.waitUntil(async () => await toast.toastTitle.isDisplayed());
      await toast.clearAllToast();
      await expect(page.chplProductNumber).not.toBe(initialChplProductNumber);
      const { previousChplProductNumbers } = page;
      await expect(previousChplProductNumbers.includes(initialChplProductNumber)).toBeTruthy();
    });

    it('should show allow searching by the old number', async () => {
      const productCode = (`${Date.now()}`).substring(9);
      const versionCode = (`${Date.now()}`).substring(11);
      const initialChplProductNumber = page.chplProductNumber;

      await login.logIn('drummond');
      await page.editCertifiedProduct.click();
      await hooks.waitForSpinnerToDisappear();
      await listingEdit.chplProductNumberProdCode.doubleClick();
      await listingEdit.chplProductNumberProdCode.addValue(productCode);
      await listingEdit.chplProductNumberVerCode.doubleClick();
      await listingEdit.chplProductNumberVerCode.addValue(versionCode);
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await listingEdit.warningLabel.click();
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await browser.waitUntil(async () => await toast.toastTitle.isDisplayed());
      await toast.clearAllToast();
      await hooks.open('#/collections/real-world-testing');
      await browser.waitUntil(async () => !searchPage.isLoading);
      await searchPage.searchForText(initialChplProductNumber);
      await expect(await searchPage.getTableCellText(searchPage.results[0], 0)).not.toContain(initialChplProductNumber);
    });
  });

  // ignore two flaky listing edit tests and address after ui upgrade flag is removed
  xdescribe('when editing a 2011 edition listing', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/41');
    });

    it('should be able to add reason for edit and save edits', async () => {
      const timestamp = Date.now();
      const mandatoryDisclosureUrl = `https://website${timestamp}.com`;
      await login.logIn('onc');
      await page.editCertifiedProduct.click();
      await hooks.waitForSpinnerToDisappear();
      await listingEdit.mandatoryDisclosures.setValue(mandatoryDisclosureUrl);
      await listingEdit.reasonForChange.setValue('test reason');
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await browser.waitUntil(async () => await toast.toastTitle.isDisplayed());
      await toast.clearAllToast();
      await expect(await page.listingBasicInformation.getText()).toContain(mandatoryDisclosureUrl);
    });
  });

  xdescribe('when editing a 2014 edition listing', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/437');
    });

    it('should be able to add reason for edit and save edits', async () => {
      const timestamp = Date.now();
      const mandatoryDisclosureUrl = `https://website${timestamp}.com`;
      await login.logIn('onc');
      await page.editCertifiedProduct.click();
      await hooks.waitForSpinnerToDisappear();
      await listingEdit.mandatoryDisclosures.setValue(mandatoryDisclosureUrl);
      await listingEdit.reasonForChange.setValue('test reason');
      await action.save();
      await hooks.waitForSpinnerToDisappear();
      await browser.waitUntil(async () => await toast.toastTitle.isDisplayed());
      await toast.clearAllToast();
      await expect(await page.listingBasicInformation.getText()).toContain(mandatoryDisclosureUrl);
    });
  });
});
