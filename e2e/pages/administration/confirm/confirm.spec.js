// This test is using AQA3 upload file

import ConfirmPage from './confirm.po';
import UploadPage from '../upload/upload.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../../components/toast/toast.po';

let confirmPage, hooks, loginComponent, toast,uploadPage;
const rejectListingId1 = '15.04.04.1722.AQA3.03.01.1.200620';
const rejectListingId2 = '15.04.04.1722.AQA4.03.01.1.200620';

describe('when user is on confirm listing page', () => {
  beforeEach(() => {
    uploadPage = new UploadPage();
    confirmPage = new ConfirmPage();
    loginComponent = new LoginComponent();
    toast = new ToastComponent();
    hooks = new Hooks();
    hooks.open('#/administration/upload');
    loginComponent.logIn('acb');
  });

  afterEach(() => {
    toast.clearAllToast();
    loginComponent.openLoginComponent();
    loginComponent.logOut();
  });

  describe('and uploading a listing', () => {
    beforeEach(() => {
      uploadPage.uploadListing('../../../resources/listings/2015_v19_AQA3.csv');
      uploadPage.waitForSuccessfulUpload('AQA3');
    });

    afterEach(() => {
      toast.clearAllToast();
    });

    it('should allow user to reject a file', () => {
      hooks.open('#/administration/confirm/listings');
      confirmPage.rejectListing(rejectListingId1);
      expect(toast.toastTitle.getText()).toBe('Success');
      expect(confirmPage.findListingtoReject(rejectListingId1).isDisplayed()).toBe(false);
    });
  });

  describe('and uploading multiple listing', () => {
    beforeEach(() => {
      uploadPage.uploadListing('../../../resources/listings/2015_v19_AQA3.csv');
      uploadPage.waitForSuccessfulUpload('AQA3');
      uploadPage.uploadListing('../../../resources/listings/2015_v19_AQA4.csv');
      uploadPage.waitForSuccessfulUpload('AQA4');
    });

    afterEach(() => {
      toast.clearAllToast();
    });

    it('should allow user to mass reject multiple listings', () => {
      hooks.open('#/administration/confirm/listings');
      confirmPage.rejectListingcheckbox(rejectListingId1);
      confirmPage.rejectListingcheckbox(rejectListingId2);
      confirmPage.rejectButton.waitAndClick();
      hooks.waitForSpinnerToDisappear();
      expect(toast.toastTitle.getText()).toBe('Success');
      expect(confirmPage.findListingtoReject(rejectListingId1).isDisplayed()).toBe(false);
      expect(confirmPage.findListingtoReject(rejectListingId2).isDisplayed()).toBe(false);
    });
  });
});
