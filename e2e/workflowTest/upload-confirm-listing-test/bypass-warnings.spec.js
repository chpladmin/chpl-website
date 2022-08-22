import Upload from '../../components/upload/upload-listing/upload-listing.po';
import Confirm from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';

let confirm;
let hooks;
let loginComponent;
let toast;
let upload;

const listingIdNoWarningError = '15.04.04.1722.AQA3.03.01.1.200620';
const listingIdWithWarning = '15.04.04.1722.AQA4.03.01.1.200620';

describe('when testing the "bypass warnings" feature', () => {
  beforeAll(() => {
    upload = new Upload();
    confirm = new Confirm();
    loginComponent = new LoginComponent();
    toast = new ToastComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.logIn('acb');
  });

  afterEach(() => {
    browser.refresh();
  });

  xdescribe('listing with no confirm warnings and no errors', () => {
    beforeEach(() => {
      upload.uploadFileAndWaitForListingsToBeProcessed('../../../resources/listings/2015_v19_AQA3.csv', [listingIdNoWarningError], hooks, confirm);
    });

    it('should not show warning bypass checkbox and confirm works successfully', () => {
      confirm.gotoConfirmListingPage(listingIdNoWarningError);
      confirm.confirmListing();
      expect(confirm.warningCheckbox.isDisplayed()).toBe(false);
      browser.waitUntil(() => toast.toastContainer.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Please stand by');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastContainer.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Success');
    });
  });

  xdescribe('listing with warnings on confirm and no errors', () => {
    beforeEach(() => {
      upload.uploadFileAndWaitForListingsToBeProcessed('../../../resources/listings/2015_v19_AQA3.csv', [listingIdWithWarning], hooks, confirm);
    });

    it('should show warning bypass checkbox while confirming', () => {
      confirm.gotoConfirmListingPage(listingIdWithWarning);
      confirm.confirmListing();
      hooks.waitForSpinnerToDisappear();
      expect(confirm.warningCheckbox.isDisplayed()).toBe(true);
    });

    it('should not get confirmed until bypasscheckbox is checked', () => {
      confirm.gotoConfirmListingPage(listingIdWithWarning);
      confirm.confirmListing();
      browser.waitUntil(() => confirm.warningCheckbox.isDisplayed());
      confirm.confirmListing();
      hooks.waitForSpinnerToDisappear();
      expect(confirm.confirmButton.isDisplayed()).toBe(true);
    });

    it('should get confirm if user checks checkbox for bypass warnings', () => {
      confirm.gotoConfirmListingPage(listingIdWithWarning);
      confirm.confirmListing();
      hooks.waitForSpinnerToDisappear();
      confirm.warningCheckbox.click();
      confirm.confirmListing();
      browser.waitUntil(() => toast.toastContainer.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Please stand by');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      browser.waitUntil(() => toast.toastContainer.isDisplayed());
      expect(toast.toastTitle.getText()).toBe('Success');
    });
  });
});
