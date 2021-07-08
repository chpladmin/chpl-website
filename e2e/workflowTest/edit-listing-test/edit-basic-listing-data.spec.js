import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import LoginComponent from '../../components/login/login.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import ToastComponent from '../../components/toast/toast.po';
import ListingEditComponent from '../../components/listing/edit/listing-edit.po';

let action;
let hooks;
let login;
let page;
let toast;
let listingEdit;

describe('On 2015 Listing details page', () => {
  const timestamp = Date.now();
  const plansDateInput = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const plansDateDisplay = `${new Date().toLocaleString('en-us', { month: 'short' })} ${new Date().getDate()}, ${new Date().getFullYear()}`;
  const testPlansUrl = `https://testPlansUrl${timestamp}.com`;
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const resultsDateInput = nextDay.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const resultsDateDisplay = `${nextDay.toLocaleString('en-us', { month: 'short' })} ${new Date().getDate()}, ${new Date().getFullYear()}`;
  const testResultsUrl = `https://testResultsUrl${timestamp}.com`;

  beforeEach(async () => {
    listingEdit = new ListingEditComponent();
    page = new ListingPage();
    hooks = new Hooks();
    toast = new ToastComponent();
    login = new LoginComponent();
    action = new ActionBarComponent();
    await hooks.open('#/listing/9715');
  });

  describe('When ACB is logged in and opens listing page in edit mode', () => {
    beforeEach(async () => {
      login.logIn('drummond');
      page.editCertifiedProduct.click();
      hooks.waitForSpinnerToDisappear();
    });

    afterEach(async () => {
      login.logOut();
    });

    it('should be able to add RWT data to the listing and save edits', () => {
      listingEdit.rwtPlansUrl.setValue(testPlansUrl);
      listingEdit.rwtPlansCheckDate.setValue(plansDateInput);
      listingEdit.rwtResultsUrl.setValue(testResultsUrl);
      listingEdit.rwtResultsCheckDate.setValue(resultsDateInput);
      action.save();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastTitle.isDisplayed());
      expect(page.listingBasicInformation.getText()).toContain(testPlansUrl);
      expect(page.listingBasicInformation.getText()).toContain(`Last ONC-ACB Completeness Check: ${plansDateDisplay}`);
      expect(page.listingBasicInformation.getText()).toContain(testResultsUrl);
      expect(page.listingBasicInformation.getText()).toContain(`Last ONC-ACB Completeness Check: ${resultsDateDisplay}`);
    });
  });
});
