// This test is using AQA5 upload listing

import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirmPage , hooks, loginComponent, uploadPage;

beforeEach(() => {
  uploadPage = new UploadPage();
  confirmPage = new ConfirmPage();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  hooks.open('#/administration/upload');
  loginComponent.logIn('acb');
});

describe('when ACB inspects uploaded listing with both cures and original criteria', () => {
  beforeEach(function () {
    hooks.open('#/administration/upload');
    uploadPage.uploadListing('../../../resources/listings/2015_v20_AQA5.csv');
    uploadPage.waitForSuccessfulUpload('AQA5');
    hooks.open('#/administration/confirm/listings');
  });

  it('should show correct error message', () => {
    confirmPage.gotoConfirmListingPage('15.04.04.1722.AQA5.03.01.1.200620');
    expect(confirmPage.errorMessage.getText()).toContain('Cannot select both 170.315 (b)(3) and 170.315 (b)(3) (Cures Update).');
  });
});
