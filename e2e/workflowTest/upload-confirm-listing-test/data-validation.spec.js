import UploadPage from '../../pages/administration/upload/upload.po';
import ConfirmPage from '../../pages/administration/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';

let confirmPage , hooks, loginComponent, uploadPage;
const listingId = '13A!.99.02.8990.ABC.0A.00.A.190729';

beforeEach( () => {
  uploadPage = new UploadPage();
  confirmPage = new ConfirmPage();
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  hooks.open('#/administration/upload');
  loginComponent.logIn('acb');
});

describe('listing with no confirm warnings and no errors', () => {
  
  beforeEach(function () {
    if (uploadListingComponent.uploadBetaButton.isDisplayed()) {
      uploadListingComponent.uploadListingBeta(path);
      browser.waitUntil( () => toast.toastTitle.isDisplayed());
    }
    uploadPage.uploadListing('../../../resources/upload-listing-beta/2015_InvalidData.csv');
    hooks.open('#/administration/confirm/listings');
  });

  it('should not show warning bypass checkbox and confirm works successfully', () => {
    
    // need to change this to inspect listing instead of confirm listing ( create new function)- wait until code is ready
    confirmPage.gotoConfirmListingPage(listingId);
    
  });

});
