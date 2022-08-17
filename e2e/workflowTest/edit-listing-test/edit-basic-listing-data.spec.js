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

describe('On 2015 Listing details page', () => {
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

  describe('when editing RWT data', () => {
    beforeEach(async () => {
      await hooks.open('#/listing/9715');
    });

    it('should be able to add RWT data to the listing and save edits', () => {
      const timestamp = Date.now();
      const plansDateInput = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const plansDateDisplay = `${new Date().toLocaleString('en-us', { month: 'short' })} ${new Date().getDate()}, ${new Date().getFullYear()}`;
      const testPlansUrl = `https://testPlansUrl${timestamp}.com`;
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      const resultsDateInput = nextDay.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const resultsDateDisplay = `${nextDay.toLocaleString('en-us', { month: 'short' })} ${new Date().getDate()}, ${new Date().getFullYear()}`;
      const testResultsUrl = `https://testResultsUrl${timestamp}.com`;

      login.logIn('drummond');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
      listingEdit.rwtPlansUrl.setValue(testPlansUrl);
      listingEdit.rwtPlansCheckDate.setValue(plansDateInput);
      listingEdit.rwtResultsUrl.setValue(testResultsUrl);
      listingEdit.rwtResultsCheckDate.setValue(resultsDateInput);
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      toast.clearAllToast();
      expect(page.listingBasicInformation.getText()).toContain(testPlansUrl);
      expect(page.listingBasicInformation.getText()).toContain(`Last ONC-ACB Completeness Check: ${plansDateDisplay}`);
      expect(page.listingBasicInformation.getText()).toContain(testResultsUrl);
      expect(page.listingBasicInformation.getText()).toContain(`Last ONC-ACB Completeness Check: ${resultsDateDisplay}`);
    });
  });

  xdescribe('when changing CHPL Product Number data', () => {
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
});
