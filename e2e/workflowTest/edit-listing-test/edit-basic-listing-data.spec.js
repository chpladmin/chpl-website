import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import LoginComponent from '../../components/login/login.sync.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
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

  afterEach(async () => {
    login.logOut();
  });

  xdescribe('when changing CHPL Product Number data of 2015 edition listing', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/9902');
    });

    it('should show changes on the Listing page', () => {
      const productCode = (`${Date.now()}`).substring(9);
      const versionCode = (`${Date.now()}`).substring(11);
      const initialChplProductNumber = page.chplProductNumber;

      login.logIn('drummond');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
      listingEdit.chplProductNumberProdCode.doubleClick();
      listingEdit.chplProductNumberProdCode.addValue(productCode);
      listingEdit.chplProductNumberVerCode.doubleClick();
      listingEdit.chplProductNumberVerCode.addValue(versionCode);
      action.save();
      hooks.waitForSpinnerToDisappear();
      listingEdit.warningLabel.click();
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      toast.clearAllToast();
      expect(page.chplProductNumber).not.toBe(initialChplProductNumber);
      const { previousChplProductNumbers } = page;
      expect(previousChplProductNumbers.includes(initialChplProductNumber)).toBeTruthy();
    });

    it('should show allow searching by the old number', () => {
      const productCode = (`${Date.now()}`).substring(9);
      const versionCode = (`${Date.now()}`).substring(11);
      const initialChplProductNumber = page.chplProductNumber;

      login.logIn('drummond');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
      listingEdit.chplProductNumberProdCode.doubleClick();
      listingEdit.chplProductNumberProdCode.addValue(productCode);
      listingEdit.chplProductNumberVerCode.doubleClick();
      listingEdit.chplProductNumberVerCode.addValue(versionCode);
      action.save();
      hooks.waitForSpinnerToDisappear();
      listingEdit.warningLabel.click();
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      toast.clearAllToast();
      hooks.open('#/collections/real-world-testing');
      browser.waitUntil(() => !searchPage.isLoading);
      searchPage.searchForText(initialChplProductNumber);
      expect(searchPage.getTableCellText(searchPage.results[0], 0)).not.toContain(initialChplProductNumber);
    });
  });

  // ignore two flaky listing edit tests and address after ui upgrade flag is removed
  xdescribe('when editing a 2011 edition listing', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/41');
    });

    it('should be able to add reason for edit and save edits', () => {
      const timestamp = Date.now();
      const mandatoryDisclosureUrl = `https://website${timestamp}.com`;
      login.logIn('onc');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
      listingEdit.mandatoryDisclosures.setValue(mandatoryDisclosureUrl);
      listingEdit.reasonForChange.setValue('test reason');
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      toast.clearAllToast();
      expect(page.listingBasicInformation.getText()).toContain(mandatoryDisclosureUrl);
    });
  });

  xdescribe('when editing a 2014 edition listing', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/437');
    });

    it('should be able to add reason for edit and save edits', () => {
      const timestamp = Date.now();
      const mandatoryDisclosureUrl = `https://website${timestamp}.com`;
      login.logIn('onc');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
      listingEdit.mandatoryDisclosures.setValue(mandatoryDisclosureUrl);
      listingEdit.reasonForChange.setValue('test reason');
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      toast.clearAllToast();
      expect(page.listingBasicInformation.getText()).toContain(mandatoryDisclosureUrl);
    });
  });
});
