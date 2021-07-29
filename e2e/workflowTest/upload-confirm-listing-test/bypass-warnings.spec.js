// This test is using AQA3 and AQA4 upload listing

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';

let confirmPage , hooks, loginComponent, toast, uploadPage;
const listingIdNoWarningError = '15.04.04.1722.AQA3.03.01.1.200620';
const listingIdWithWarning = '15.04.04.1722.AQA4.03.01.1.200620';

// **Run once before the first test case**
beforeAll( () => {
  uploadPage = new UploadPage();
  confirmPage = new ConfirmPage();
  loginComponent = new LoginComponent();
  toast = new ToastComponent();
  hooks = new Hooks();
  hooks.open('#/administration/upload');
  loginComponent.logIn('acb');
});

describe('listing with no confirm warnings and no errors', () => {
  // **Run once before each test case**
  beforeEach(function () {
    uploadPage.uploadListing('../../../resources/listings/2015_v19_AQA3.csv');
    uploadPage.waitForSuccessfulUpload('AQA3');
    hooks.open('#/administration/confirm/listings');
  });

  it('should not show warning bypass checkbox and confirm works successfully', () => {
    confirmPage.gotoConfirmListingPage(listingIdNoWarningError);
    confirmPage.confirmListing();
    expect(confirmPage.warningCheckbox.isDisplayed()).toBeFalse;
    browser.waitUntil(() => toast.toastContainer.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Please stand by');
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => toast.toastContainer.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Success');
  });
  afterEach(function () {
    browser.refresh();
  });
});

describe('listing with warnings on confirm and no errors', () => {

  beforeAll(function () {
    hooks.open('#/administration/upload');
    uploadPage.uploadListing('../../../resources/listings/2015_v19_AQA4.csv');
    uploadPage.waitForSuccessfulUpload('AQA4');
    hooks.open('#/administration/confirm/listings');
    hooks.waitForSpinnerToDisappear();
  });

  it('should show warning bypass checkbox while confirming', () => {
    confirmPage.gotoConfirmListingPage(listingIdWithWarning);
    confirmPage.confirmListing();
    hooks.waitForSpinnerToDisappear();
    expect(confirmPage.warningCheckbox.isDisplayed()).toBeTrue;
  });

  it('should not get confirmed until bypasscheckbox is checked', () => {
    confirmPage.gotoConfirmListingPage(listingIdWithWarning);
    confirmPage.confirmListing();
    browser.waitUntil( () => confirmPage.warningCheckbox.isDisplayed());
    confirmPage.confirmListing();
    hooks.waitForSpinnerToDisappear();
    expect(confirmPage.confirmButton.isDisplayed()).toBeTrue;
  });

  it('should get confirm if user checks checkbox for bypass warnings', () => {
    confirmPage.gotoConfirmListingPage(listingIdWithWarning);
    confirmPage.confirmListing();
    hooks.waitForSpinnerToDisappear();
    confirmPage.warningCheckbox.click();
    confirmPage.confirmListing();
    browser.waitUntil(() => toast.toastContainer.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Please stand by');
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => toast.toastContainer.isDisplayed())
    expect(toast.toastTitle.getText()).toBe('Success');
  });

  afterEach(function () {
    browser.refresh();
  });

});
